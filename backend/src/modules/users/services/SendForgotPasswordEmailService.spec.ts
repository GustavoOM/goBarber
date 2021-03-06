import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider"
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository()

    
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
      );

  })

  it('should be able to recover the password using the email', async () => {
      
      const sendEmail = jest.spyOn(fakeMailProvider, "sendMail")
      
      await fakeUsersRepository.create({
        name: 'João Câmara',
        email: 'teste@teste.com',
        password: 'teste123'
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@teste.com',
    });

    expect(sendEmail).toHaveBeenCalled()
  });

  it("should not be able to recover a non-existing user password", async () => {

    const sendEmail = jest.spyOn(fakeMailProvider, "sendMail")

    await expect(sendForgotPasswordEmail.execute({
      email: 'teste@teste.com',
    })).rejects.toBeInstanceOf(AppError)
  })

  it("should generate a forgot password token", async () => {

    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate")

    const user = await fakeUsersRepository.create({
        name: 'João Câmara',
        email: 'teste@teste.com',
        password: 'teste123'
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@teste.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })

});

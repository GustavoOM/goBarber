import React, {useCallback, useRef} from "react"
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from "react-native"
import Button from "../../components/Button"
import Input from "../../components/Input"
import logoImg from "../../assets/logo.png"
import Icon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import * as Yup from "yup"
import getValidationErrors from "../../utils/getValidationsErrors"
import { Form } from "@unform/mobile"
import { FormHandles } from "@unform/core"
import { useAuth } from "../../hooks/auth"
import {Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText} from "./styles"

interface SignInFormData{
        email: string
        password: string
    }

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null) 
    const passwordInputRef = useRef<TextInput>(null)
    const navigation = useNavigation();

    const { signIn } = useAuth()

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try{
            formRef.current?.setErrors({})
            const schema = Yup.object().shape({
                email: Yup.string().required("E-mail obrigatório").email("Digite um email válido"),
                password: Yup.string().required("Senha obrigatória")
            })

            await schema.validate(data, {
                abortEarly: false
            })

            await signIn({
                email: data.email,
                password: data.password
            })

            
        }catch (err){
            if(err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors)

                return
            }

            Alert.alert("Erro na autenticação", "Login ou senha invalidos, cheque as credenciais.", )

        }
    }, [signIn])

    return(
        <>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding": undefined} >
                <ScrollView keyboardShouldPersistTaps="handled" >
                    <Container>
                        <Image source={logoImg} style={{marginTop:30}}/>
                        <View>
                            <Title>Faça seu logon</Title>
                        </View>
                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input 
                                autoCorrect={false} 
                                autoCapitalize="none" 
                                keyboardType="email-address" 
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail (Ex: exemplos@exe.com)" 
                                returnKeyType="next" 
                                onSubmitEditing={() => { 
                                    passwordInputRef.current?.focus() 
                                }} 
                            /> 

                            <Input 
                                ref={passwordInputRef} 
                                name="password" 
                                icon="lock" 
                                placeholder="Senha (No mínimo 6 caracteres)" 
                                secureTextEntry 
                                returnKeyType="send" 
                                onSubmitEditing={() => { 
                                    formRef.current?.submitForm() 
                                }} 
                            />

                            <View>
                                <Button onPress={() => {formRef.current?.submitForm()}}>Entrar</Button>
                            </View>
                        </Form>
                            <ForgotPassword onPress={() => {}}>
                            <View>
                                    <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                            </View>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <CreateAccountButton onPress={() => navigation.navigate("SignUp")}>
                <Icon name="log-in" size={20} color="#ff9000"/>
                <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    )
}

export default SignIn
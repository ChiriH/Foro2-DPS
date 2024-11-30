import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { GoogleSignin, isErrorWithCode, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


const index = () => {
    //Login Google
    const [initializing, setInitalizing] = useState(true);
    const [user, setUser] = useState();
    //Login email y contra
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //Register o Login
    const [isLogin, setIsLogin] = useState(true); 


    //CONFIGURACION FIREBASE ID
    
    GoogleSignin.configure({
        webClientId: '74065978403-f7u7pv6i631jr5kmuffts1lc32v91p7h.apps.googleusercontent.com',
    });

    //LOGIN GOOGLE (DOCUMENTACION)
    const signIn = async () =>{
        
        try{
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const response = await GoogleSignin.signIn();
            console.log('respuesta', response);

            const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);

            return auth().signInWithCredential(googleCredential);
        }catch(error){
            if (isErrorWithCode(error)){
                switch(error.code){
                    case statusCodes.IN_PROGRESS:
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        break;

                    default:
                }
            }else{

            }
        }
    };
    //INICIO DE SESION CORREO Y CONTRASEÑA

    const signInWithEmailAndPassword = async () => {
        if (!email || !password) {
          setError('Completa todos los campos antes de iniciar sesión');
          return;
        }
        try {
          await auth().signInWithEmailAndPassword(email, password);
          setError('');
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };
    //REGISTRO CORREO Y CONTRASEÑA
      const signUpWithEmailAndPassword = async () => {
        if (!email || !password) {
          setError('Completa todos los campos para crear tu cuenta');
          return;
        }
        try {
          await auth().createUserWithEmailAndPassword(email, password);
          setError('');
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      };
    


    function onAuthStateChanged(user){
        setUser(user);
        if(initializing) setInitalizing(false);
    }

    useEffect(() => {
         const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
         return subscriber;
    }, []);
    if (initializing) return null;

    if(!user){
       return(
        <SafeAreaView style={styles.padre}>
                <View  style={styles.tarjeta}>
                    <Text style={styles.title}>{isLogin ? 'Inicio de sesión' : 'Crear una cuenta'}</Text>

                    <View style={styles.textInput}>
                        <TextInput style={{paddingHorizontal:15, color: '#F2F2F2'}}
                            placeholder="Correo"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View  style={styles.textInput}>
                        <TextInput style={{paddingHorizontal:15, color: '#F2F2F2'}}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        />
                    </View>
                    {error ? <Text style={styles.error}>{error}</Text> : null}


                    <View>
                        <TouchableOpacity onPress={isLogin ? signInWithEmailAndPassword : signUpWithEmailAndPassword} style={styles.cajaBoton}>
                            <Text style={styles.textoBoton}>{isLogin ? 'Iniciar sesión' : 'Registrarme'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.navButton}>
                        <Text style={styles.navButtonText}>
                            {isLogin ? 'Crear cuenta' : '¿Ya tienes cuenta? Iniciar sesión'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.googleSignInText}>- O ingresa con Google -</Text>


                    <GoogleSigninButton
                            style={styles.googleButton}
                            size={GoogleSigninButton.Size.Icon}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={signIn}
                        />
                </View>
        </SafeAreaView>
       )
    }

  return (
    
    <View style={styles.padre}>
        <View style={styles.tarjeta}>
            <Text style={styles.loginTitle}>
                    Bienvenido  {user.email}!
            </Text> 
                <TouchableOpacity onPress={() => auth().signOut()} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
        </View>
    </View>

  );
}

export default index

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    tarjeta: {
        margin: 20,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        width: '90%',
        padding: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    loginTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    textInput: {
        paddingVertical: 10,
        backgroundColor: '#767676',
        borderRadius: 5,
        marginVertical: 10,
      
    },
   
    cajaBoton: {
        backgroundColor: '#0074E4',
        borderRadius: 5,
        paddingVertical: 10,
        margin: 'auto',
        width: '50%',
        marginTop: 10,
    },
     
    textoBoton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
    },
    logoutButton: {
        backgroundColor: '#DE3341',
        borderRadius: 5,
        paddingVertical: 10,
        margin: 'auto',
        width: '50%',
        marginTop: 10,
    },
     
    logoutButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
    },
    googleSignInText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#F2F2F2',
        marginTop: 20,
        marginBottom: 10,
    },
    googleButton: {
        height: 50,
        width: 100,
        margin: 'auto',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    navButton: {
        marginTop: 20,
        marginBottom: 10,
        
    },
    navButtonText: {
        color: '#0066cc',
        
        textAlign: 'center',
    },
});

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ImageBackground,
  Image,
  KeyboardAvoidingView
} from "react-native";
import firebase from "firebase";

const bg = require('../assets/background2.png')
const appIconImage = require('../assets/appIcon.png')

export default class LogIn extends Component{
    constructor(){
        super()
        this.state={
            email:'',
            password:''
        }
    }

    handleLogIn=async(email,password)=>{
     firebase.auth().signInWithEmailAndPassword(email,password)
     .then(()=>{
        this.props.navigation.navigate("BottomTab")
     })
     .catch(error=>{
        alert(error.message)
     })
    }

    render(){
        const{email,password}=this.state
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
             <ImageBackground source={bg} style={styles.bgImage}>
                <View style={styles.upperContainer}>
                 <Image source={appIconImage} style={styles.appIconImage} />
                </View>
                <View style={styles.lowerContainer}>
                <TextInput
                 style={styles.textinput}
                 onChangeText={text=>this.setState({email:text})}
                 placeholder={"type email here"}
                 autoFocus
                />
                <TextInput
                 style={styles.textinput}
                 onChangeText={text => this.setState({password:text})}
                 placeholder={"type password here"}
                 secureTextEntry
                 />
                 <TouchableOpacity
                  style={styles.button}
                  onPress={()=>this.handleLogIn(email,password)}
                 >
                  <Text style={styles.buttonText}>LogIn</Text>
                 </TouchableOpacity>
                </View>
             </ImageBackground>
            </KeyboardAvoidingView>
        )
    }
} 


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF"
    },
    bgImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
  
    upperContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    appIcon: {
      width: 280,
      height: 280,
      resizeMode: "contain",
      marginTop: 80
    },
    appName: {
      width: 130,
      height: 130,
      resizeMode: "contain"
    },
    lowerContainer: {
      flex: 0.5,
      alignItems: "center"
    },
    textinput: {
      width: "75%",
      height: 55,
      padding: 10,
      borderColor: "#FFFFFF",
      borderWidth: 4,
      borderRadius: 10,
      fontSize: 18,
      color: "#FFFFFF",
      fontFamily: "Rajdhani_600SemiBold",
      backgroundColor: "#5653D4"
    },
    button: {
      width: "43%",
      height: 55,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F48D20",
      borderRadius: 15
    },
    buttonText: {
      fontSize: 24,
      color: "#FFFFFF",
      fontFamily: "Rajdhani_600SemiBold"
    }
  });
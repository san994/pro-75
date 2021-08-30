import React,{Component} from 'react';
import { StyleSheet, Text, TouchableOpacity, View,TextInput,ImageBackground,Image,KeyboardAvoidingView } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions'

import db from '../config';
import firebase from "firebase";

import { TapGestureHandler } from 'react-native-gesture-handler';

const bgImage  = require("../assets/background2.png")
const bicycleImage  = require("../assets/bicycle.png")
const appIconImage  = require("../assets/appIcon.png")

export default class RideScreen extends Component{
    constructor(){
        super()
        this.state = {
            domState:'normal',
            hasCameraPermission:null,
            scanned:false,
            userId:'',
            bicycleId:'',
            bikeType:'',
            userName:'',
            bikeAssign:true
        }
    }

    getCameraPermisson = async(domState)=>{
      const{status} = await Permissions.askAsync(Permissions.CAMERA)
      this.setState({
          hasCameraPermission:status === "granted",
          domState:domState,
          scanned:false
      })
    }

    handleBarcodeScanned =async({type,data})=>{
        const{domState}=this.state
     if(domState==="bicycleId"){
      this.setState({
          domState:"bicycleId",
          scanned:true,
          bicycleId:data
      })
     }
     if(domState==="userId"){
        this.setState({
            domState:"userId",
            scanned:true,
            userId:data
        })
     }
    }

    handleTransaction = async()=>{
      var{bicycleId,userId} = this.state

       this.getBikeDetails(bicycleId)
       this.getuserDetails(userId)
       
       var transactionType = await this.checkBikeAvailability()
      // db.collection('bike')
      // .doc(bicycleId)
      // .get()
      // .then(doc=>{
      //   var bike = doc.data()

      //   if(bike.is_bike_available == true){
      //     var{bikeType,userName} = this.state
      //     this.assignBike(bicycleId,userId,userName,bikeType)
      //   }else{
      //     var{bikeType,userName} = this.state
      //     this.returnBike(bicycleId,userId,userName,bikeType)
      //   }
      // })
     
       if(!transactionType){

         this.setState({bikeId:"",userId:""})
         alert("bike doesnt exist")

       }else if(transactionType === "rented"){

       var Eligible = await this.isUserEligible()

       if(Eligible){

        var{userName,bikeType} = this.state
        this.assignBike(bicycleId,userId,userName,bikeType)

       }
     

       }else if(transactionType === "return"){
        var Eligible = await this.isUserEligible()

       if(Eligible){

        var{userName,bikeType} = this.state
        this.returnBike(bicycleId,userId,userName,bikeType)

       }
     
      }
      
    }

    assignBike =async(bikeId,userId,userName,bikeType)=>{
        
      //create a transaction
      db.collection("transaction").add({
        bike_id:bikeId,
        user_id:userId,
        user_Name:userName,
        bike_Type:bikeType,
        transaction_type:"rented",
        date:firebase.firestore.Timestamp.now().toDate()
      })
      
      //change the status of bike
      db.collection('bike')
      .doc(bikeId)
      .update({
        is_bike_available:false
      })

      //change the status of user
      db.collection('user')
      .doc(userId)
      .update({
        bike_assigned:true
      })

      alert("you have rented the bike for 1 hour")
      this.setState({
        bikeId:'',
        bikeAssign:true
      })

    } 

    returnBike =async(bikeId,userId,userName,bikeType)=>{
        
      //create a transaction
      db.collection("transaction").add({
        user_id: userId,
        user_name: userName,
        bike_id: bikeId,
        bike_type:bikeType,
        date: firebase.firestore.Timestamp.now().toDate(),
        transaction_type: "return"
      });
      
      //change the status of bike
      db.collection('bike')
      .doc(bikeId)
      .update({
        is_bike_available:true
      })

      //change the status of user
      db.collection('user')
      .doc(userId)
      .update({
        bike_assigned:false
      })

      alert('hope you enjyed the ride')
      this.setState({
        bikeId:'',
        bikeAssign:false
      })

    } 


    getBikeDetails =async bikeId => {
      bikeId = bikeId.trim();
      db.collection("bike")
        .where("bike_id", "==", bikeId)
        .get()
        .then(snapshot => {
          snapshot.docs.map(doc => {
            this.setState({
              bikeType: doc.data().bike_details.bike_type
            });
          });
        });
    };
  
    getuserDetails =async userId => {
      userId = userId.trim();
      db.collection("user")
        .where("user_id","==", userId)
        .get()
        .then(snapshot => {
          snapshot.docs.map(doc => {
            this.setState({
              userName: doc.data().user_details.user_name
            });
          });
        });
    };


    checkBikeAvailability=async()=>{
      const bikeRef = await db
      .collection('bike')
      .where('bike_id','==',this.state.bicycleId)
      .get()
    
      console.log(bikeRef)
      var transactionType = ''
      if(bikeRef.docs.length == 0){
        transactionType = false
      }else{
        bikeRef.docs.map(doc=>{
          transactionType = doc.data().is_bike_available?'rented':'return';
        })
      }
      return transactionType;
    }
  
 
      isUserEligible=async()=>{
        const transactionRef = await db
        .collection('transaction')
        .where('bike_id',"==",this.state.bicycleId)
        .limit(1)
        .get()

        var isUserEligible = ''
        transactionRef.docs.map(doc=>{
          var lastBikeTransaction = doc.data()
          if(lastBikeTransaction.user_id === this.state.userId){
            isUserEligible = true
          }else{
            isUserEligible = false
            alert("this bike is taken by another user")
            this.setState({
              bicycleId:""
            })
          }
        })
        return isUserEligible
      }

    render(){
       const{domState,hasCameraPermission,scanned,scannedData,userId,bicycleId,bikeAssign} = this.state
          if(domState !== "normal"){
              return(
                  <BarCodeScanner
                    onBarCodeScanned = {scanned?undefined:this.handleBarcodeScanned}
                  />
              )
          }
        return(
         <KeyboardAvoidingView style = {styles.container}>
            <ImageBackground source={bgImage} style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image source={appIconImage} style={styles.appIconImage} />
          </View>
          <View style = {styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={"user Id"}
                placeholderTextColor={"#FFFFFF"}
                value={userId}
                onChangeText={text => this.setState({userId:text})}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("bookId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}
                placeholder={"bicycle Id"}
                placeholderTextColor={"#FFFFFF"}
                value={bicycleId}
                onChangeText={text => this.setState({bicycleId:text})}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("studentId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
    
           
             <TouchableOpacity style = {styles.submitButton}
              onPress = {()=>this.handleTransaction()}>
              <Text style = {styles.submitButtonText}>
                {bikeAssign?"unlock":"Endride"}
              </Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      bgImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
      upperContainer: {
        flex: 0.7,
        justifyContent: "center",
        alignItems: "center"
      },
      appIconImage: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginTop: 80
      },
      lowerContainer: {
        flex: 0.4,
        alignItems: "center"
      },
      textinputContainer: {
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: "row",
        backgroundColor: "#9DFD24",
        borderColor: "#FFFFFF"
      },
      textinput: {
        width: "57%",
        height: 50,
        padding: 10,
        borderColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 3,
        fontSize: 18,
        backgroundColor: "#5653D4",
        fontFamily: "Rajdhani_600SemiBold",
        color: "#FFFFFF"
      },
      scanbutton: {
        width: 100,
        height: 50,
        backgroundColor: "#9DFD24",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center"
      },
      scanbuttonText: {
        fontSize: 24,
        color: "#0A0101",
        fontFamily: "Rajdhani_600SemiBold"
      },
      submitButton:{
        width: 100,
        height: 50,
        borderWidth:2,
        backgroundColor: "yellow",
        borderRadius:20,
        justifyContent: "center",
        alignItems: "center"
      },
      submitButtonText: {
        fontSize: 24,
        color: "#0A0101",
        fontFamily: "Rajdhani_600SemiBold"
      },
})
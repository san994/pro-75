
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabNavigator from './components/ButtomTabNavigator';

import LogIn from "./screen/logIn";
import { createSwitchNavigator,createAppContainer } from "react-navigation";

import {Rajdhani_600SemiBold} from '@expo-google-fonts/rajdhani';
import * as Font from 'expo-font'

export default class App extends React.Component {
 constructor(){
  super()
  this.state = {
   fontLoaded:false
  }
  }

  loadFonts =async()=>{
    await Font.loadAsync({
    Rajdhani_600SemiBold:Rajdhani_600SemiBold
    })
   this.setState({fontLoaded:true})
   }

  componentDidMount(){
    this.loadFonts
 }
 render(){
    const {fontLoaded}=this.state
   if(fontLoaded)
   return (
    <Appcontainer/>
    )
   return null
 }
}

const AppSwitchNavigator = createSwitchNavigator({

  Login:{screen:LogIn}
  ,
  BottomTab:{screen:BottomTabNavigator}
},
{
  initialRouteName:'Login'
}
)

const Appcontainer = createAppContainer(AppSwitchNavigator)

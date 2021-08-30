import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import Ionicons from "react-native-vector-icons/Ionicons"


import RideScreen from '../screen/RideScreen';
import RideHistoryScreen from '../screen/RideHistoryScreen';

const tab = createBottomTabNavigator()
export default class BottomTabNavigator extends React.Component{
    render(){
        return(
          <NavigationContainer>
              <tab.Navigator
                  
                screenOptions = {({route})=>({
                  tabBarIcon:({focused,color,size})=>{
                      let iconName;
                     if(route.name === "rideScreen"){
                        iconName = 'bicycle'
                     }else if(route.name === "rideHistoryScreen"){
                       iconName ='time'
                     }

                    return(
                      <Ionicons 
                      name = {iconName}
                      size = {size}
                      color = {color}
                      />
                    )
                  }
              })}

              tabBarOptions = {{
                  activeTintColor:"blue",
                  inactiveTintColor:"grey",
                  style:{
                   height:130,
                   borderTopWidth:0,
                   backgroundColor:"orange"
                  },
               labelStyle:{
                   fontSize:20,
                   fontFamily:"Rajdhani_600SemiBold",
               },
               labelPosition:'beside-icon',
               tabStyle:{
                   marginTop:25,
                   marginLeft:10,
                   marginRight:10,
                   borderRadius:30,
                   borderWidth: 2,
                   alignItems: "center",
                   justifyContent: "center",
                   backgroundColor: "#5653d4"
                   
               }
               }}
              >
                  <tab.Screen name = "rideScreen" component = {RideScreen}/>
                  <tab.Screen name = "rideHistoryScreen" component = {RideHistoryScreen}/>
              </tab.Navigator>
          </NavigationContainer>
        )
    }
}

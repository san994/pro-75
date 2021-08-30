import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import { Avatar, ListItem, Icon } from "react-native-elements";
import db from "../config";

export default class RideHistoryScreen extends Component{
    constructor(){
        super()
        this.state = {
          allTransactions:[],
          searchText:'',
          lastVisibleTransaction:null
        }
    }

    componentDidMount=async()=>{
        this.getTransactions()
    }

  getTransactions=()=>{
    db.collection("transaction")
      .limit(2)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction:doc
          });
        });
      });
    }

    handleSearch=async(text)=>{
       var enterText = text.toUpperCase().split("")
       text = text.toUpperCase()
       this.setState({
           allTransactions:[]
       })
       if(!text){
           this.getTransaction()
       }

       if(enterText[0] === 'B'){
           db.collection('transaction')
           .where('bike_id',"==",text)
           .limit(2)
           .get()
           .then(snapshot => {
            snapshot.docs.map(doc => {
              this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()],
                lastVisibleTransaction:doc
              });
            });
          });
       }else if(enterText[0] === 'U'){
        db.collection('transaction')
        .where('user_id',"==",text)
        .limit(2)
        .get()
        .then(snapshot => {
            snapshot.docs.map(doc => {
              this.setState({
                allTransactions: [...this.state.allTransactions, doc.data()],
                lastVisibleTransaction:doc
              });
            });
          });
    }

    }

    renderItem=({item,i})=>{
        var date = item.date
         .toDate()   
         .toString()
         .split(" ")
         .splice(0,4)
         .join(" ")
        var transactionType = 
        item.transaction_type === 'rented'?'rented':'return'

        return(
            <View style={{borderWidth:1}}>
                <ListItem key={i} bottomDevider>
                  <Icon type={'antdesign'} name={'bicycle'}/>
                  <ListItem.Content>
                      <ListItem.Title style={styles.title}>
                          {`${item.bike_name} ${item.bike_id}`}
                      </ListItem.Title>
                      <ListItem.Subtitle style={styles.subtitle}>
                          {`this book ${transactionType} by ${item.user_id}`}
                      </ListItem.Subtitle>
                      <View style={styles.lowerLeftContaiiner}>
                          <View style={styles.transactionContainer}>
                             <Text 
                             style={[
                                 styles.transactionText,
                                 {color: 
                                   item.transaction_type === "rented"
                                   ? "#78D304"
                                   : "#0364F4"
                                 }
                                 ]}>
                                      {item.transaction_type.charAt(0).toUpperCase() +
                                         item.transaction_type.slice(1)}
                                 </Text>
                                 <Icon
                                 type={'ionicon'}
                                 name={
                                     item.transaction_type === 'rented'
                                        ?"checkmark-circle-outline"
                                        : "arrow-redo-circle-outline"
                                    }
                                    color={
                                        item.transaction_type === "rented" ? "#78D304" : "#0364F4"
                                    }
                                 />
                          </View>
                          <Text style={styles.date}>{date}</Text>
                      </View>
                  </ListItem.Content>
                </ListItem>
            </View>
        )

    }

    render(){
        const{searchText,allTransactions}=this.state
        return(
         <View style = {styles.container}>
             <View style={styles.upperContainer}>
             <TextInput
                style={styles.textinput}
                placeholder={"type here"}
                placeholderTextColor={"#FFFFFF"}
                onChangeText={text => this.setState({searchText:text})}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.handleSearch(searchText)}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
             </View>
             <View style={styles.lowerContainer}>
               <FlatList
                data={allTransactions}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
               />
             </View>
         </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5653D4"
      },
      upperContainer: {
        flex: 0.2,
        justifyContent: "center",
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
      lowerContainer: {
        flex: 0.8,
        backgroundColor: "#FFFFFF"
      },
      title: {
        fontSize: 20,
        fontFamily: "Rajdhani_600SemiBold"
      },
      subtitle: {
        fontSize: 16,
        fontFamily: "Rajdhani_600SemiBold"
      },
      lowerLeftContaiiner: {
        alignSelf: "flex-end",
        marginTop: -40
      },
      transactionContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
      },
      transactionText: {
        fontSize: 20,
    
        fontFamily: "Rajdhani_600SemiBold"
      },
      date: {
        fontSize: 12,
        fontFamily: "Rajdhani_600SemiBold",
        paddingTop: 5
      },
})
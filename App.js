import React from 'react';
import {StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {storeData, getData} from "./utils/Storage";
import {CustomDrawerItems} from "./components/CustomDrawerItems"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class App extends React.Component {
    state = {
        loginVisible: false,
        assetsLoaded: false,
        userRange: 0,
        userId: 0,
        userName: '',
        pattern: /[a-zA-Z0-9]{4,20}/,
        validUsername: false,
        errorText: 'Podano nieodpowiednią nazwę użytkownika'
    }

    componentDidMount() {

        // AsyncStorage.clear();
        getData("userId").then(r => {
            if(r === undefined){
                this.setState({assetsLoaded:true, loginVisible: true})
            }else {
                let idHandler = (JSON.parse(r))
                this.setState({userId: idHandler})
                this.fetchData(idHandler)
            }
        })
    }


    updateUserRange = (range) => {
        this.setState({userRange: range})
    }

    fetchUserRange = (idHandler) => {
        fetch('http://10.0.2.2:8080/api/getRange/' + idHandler)
            .then((response) => response.json())
            .then((json) => {
                storeData(JSON.stringify(json.range), "userRange").then(r => {
                    this.setState({userRange: json.range})
                })
            })
            .catch((error) => console.error(error))
    }

    fetchSimpleDrink = (ids) => {
        ids.map((item) => {
            fetch('http://10.0.2.2:8080/api/getDrinkRecipe/' + item)
                .then((response) => response.json())
                .then((json) => {
                    storeData(JSON.stringify(json), "Drink" + item)
                })
                .catch((error) => console.error(error))
        })
    }

    fetchData = (idHandler) => {
        let ids = []
        let drinks = []
        fetch('http://10.0.2.2:8080/api/getDrinks')
            .then((response) => response.json())
            .then((json) => {
                storeData(JSON.stringify(json), "drinks")
                drinks = json
                ids = json.map((item) => item.id_drink)
            })
            .then(() => {
                this.fetchSimpleDrink(ids)
            })
            .then(() => {
                this.fetchFavoriteDrinks(drinks, idHandler)
            })
            .then(() => {
                this.fetchUserRange(idHandler)
            })
            .then(() => {
                this.setState({assetsLoaded: true})
            })
            .catch((error) => console.error(error))
    }

    fetchFavoriteDrinks = (drinks, idHandler) => {
        fetch('http://10.0.2.2:8080/api/getFavoriteDrink/' + idHandler)
            .then((response) => response.json())
            .then((json) => {
                let favoriteDrinksList = json
                storeData(JSON.stringify(json), "favoriteDrinks" + idHandler).then(() => {
                    this.setState({favoriteDrinkList: json})
                })
                    .then(() => {
                        let finalListHolder = []
                        drinks.map((item) => {
                            finalListHolder.push({
                                id_drink: item.id_drink,
                                name_drink: item.name_drink,
                                taste: item.taste,
                                method: item.method,
                                favorite: false
                            })
                        })

                        favoriteDrinksList.map((item) => {
                            let favoriteDrinkId = item.id_drink
                            finalListHolder.map((i, index) => {
                                if (i.id_drink === favoriteDrinkId) {
                                    finalListHolder[index] = {
                                        id_drink: item.id_drink,
                                        name_drink: item.name_drink,
                                        taste: item.taste,
                                        method: item.method,
                                        favorite: true
                                    }
                                }
                            })
                        })
                        storeData(JSON.stringify(finalListHolder), "FinalDrinks" + idHandler)
                    })
            })
    }

    postNewUser = () => {
        const {pattern, userName} = this.state
        if (!pattern.test(userName)) {
            this.setState({validUsername: true, errorText: 'Podano nieodpowiednią nazwę użytkownika'})
        } else {
            fetch('http://10.0.2.2:8080/api/setId/' + userName)
                .then((response) => response.json())
                .then((json) => {
                    if (json.id === 0) {
                        this.setState({errorText: 'Nazwa jest już zajęta', validUsername: true})
                    } else{
                        storeData(JSON.stringify(json.id), "userId").then(() => {
                            storeData(userName, "userName").then(() => {
                                this.setState({loginVisible: false, userId: json.id})
                            })
                        })
                            .then(() => {this.fetchData(json.id)})
                    }
                })
        }
    }

    render() {
        if (!this.state.assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <NavigationContainer>
                <Modal visible={this.state.loginVisible}>
                    <View style={styles.modalView}>
                        <Image source={require('./assets/bar.png')}/>
                        <Text style={{fontSize: 35, color: 'white', marginTop: 50}}>Register</Text>
                        <TextInput style={{
                            height: 40,
                            fontSize: 20,
                            marginTop: 40,
                            color: 'white',
                            marginHorizontal: 10,
                            borderBottomWidth: 2
                        }} numberOfLines={1}
                                   placeholderTextColor="#fff"
                                   placeholder="Enter your nickname"
                                   onChangeText={(userName) => this.setState({userName})}/>
                        <TouchableOpacity style={styles.registerButton} onPress={() => this.postNewUser()}>
                            <Text style={{color: 'white'}}>Accept</Text>
                        </TouchableOpacity>
                        {this.state.validUsername &&
                        <Text style={{marginTop: 10, color: 'white', fontSize: 15}}>{this.state.errorText}</Text>}
                    </View>
                </Modal>
                <CustomDrawerItems range={this.state.userRange} fnRefresh={this.updateUserRange}/>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: "#484848",
        padding: 50,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    registerButton: {
        backgroundColor: "#f57e00",
        borderRadius: 7,
        padding: 10,
        marginTop: 50,
        justifyContent: "center",
    },
});

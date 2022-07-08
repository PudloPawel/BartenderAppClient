import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    Image,
    TouchableOpacity, Alert
} from 'react-native';
import {storeData, getData} from "../utils/Storage";
import {DrinkShortcutTemplate} from "../components/DrinkShortcutTemplate"
import {Toolbar} from "../components/Toolbar";
import {Button, Menu, Provider} from 'react-native-paper';

export default class AddNewDrinkScreen extends React.Component {

    state = {
        listToSend: [],
        finalList: [],
        drinksList: [],
        visible: false,
        xd: false,
        assetsLoaded: false,
        drinkName: '',
        tastesList: [],
        drinkTaste: 'Choose taste',
        userId: 0,
        ingredientsList: [],
        userIngredients: [],
        drinkMethod: '',
        drinksLoaded: false
    }

    errorAlert = (alertText, errorText) =>
        Alert.alert(
            alertText,
            errorText,
            [
                {text: "OK"}
            ]
        );

    setDrinkIngredien = (ingredientName, ingredientId, index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: ingredientId,
                    ingredient_name: ingredientName,
                    visible: false
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    fetchUserAlcohols = () => {
        const {userId} = this.state
        fetch('http://10.0.2.2:8080/api/getOwnedIngredient/' + userId)
            .then((response) => response.json())
            .then((json) => {
                let listHanlder = []
                json.map((item) => {
                    listHanlder.push({
                        "ingredient_id": item.ingredient_id,
                        "ingredient_name": item.ingredient_name,
                        "visible": false
                    })
                })
                this.setState({userIngredients: listHanlder})
            })
            .catch((error) => console.error(error))
    }

    addIngredient = () => {
        const {userIngredients} = this.state
        let newIngredient = userIngredients
        newIngredient.push({
            ingredient_id: 0,
            ingredient_name: 'ingredient',
            visible: false
        })
        this.setState({userIngredients: newIngredient})
    }

    removeIngredient = (index, ingredient_id) => {
        const {userIngredients, userId} = this.state
        fetch('http://10.0.2.2:8080/api/deleteOwnedIngredient?user_id=' + userId + '&ingredient_id=' + ingredient_id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        })
            .then(() => {
                let newIngredient = userIngredients
                newIngredient.splice(index, 1)
                this.setState({userIngredients: newIngredient})
            })
            .catch((error) => console.error(error))
    }

    hideIngredientMenu = (index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    visible: false
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    showIngredientMenu = (index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    visible: true
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    componentDidMount() {
        getData("userId").then(r => {
            if (r !== undefined) {
                let id = (JSON.parse(r))
                this.setState({userId: id})
            }
        }).then(() => {
            this.fetchData()
        }).then(() => {
            this.fetchUserAlcohols()
        }).then(() => {
            this.setState({assetsLoaded: true})
        })
    }

    addFavoriteDrink = (drinkId) => {
        const {userId, finalList} = this.state
        fetch('http://10.0.2.2:8080/api/addFavoriteDrink?user_id=' + userId + '&drink_id=' + drinkId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        }).then(() => {
            let finalListHolder = finalList
            finalList.map((item, index) => {
                if (item.id_drink === drinkId) {
                    finalListHolder[index] = {
                        id_drink: item.id_drink,
                        name_drink: item.name_drink,
                        taste: item.taste,
                        method: item.method,
                        favorite: true
                    }
                }
            })
            this.setState({finalList: finalListHolder})
        }).catch((error) => console.error(error))
    }

    deleteFavoriteDrink = (drinkId) => {
        const {userId, finalList} = this.state
        fetch('http://10.0.2.2:8080/api/deleteFavoriteDrink?user_id=' + userId + '&drink_id=' + drinkId, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        }).then(() => {
            let finalListHolder = finalList
            finalList.map((item, index) => {
                if (item.id_drink === drinkId) {
                    finalListHolder[index] = {
                        id_drink: item.id_drink,
                        name_drink: item.name_drink,
                        taste: item.taste,
                        method: item.method,
                        favorite: false
                    }
                }
            })

            this.setState({finalList: finalListHolder})
        }).catch((error) => console.error(error))
    }

    sendAlcohols = () => {
        const {userIngredients, userId} = this.state
        let checkDuplicates = userIngredients.length === [...new Set(userIngredients.map(item => item.ingredient_id))].length
        let checkIngredient = false
        let xd = []
        userIngredients.map((item) => {
            if (item.ingredient_id === 0) {
                checkIngredient = true
            }
            xd.push({'id': item.ingredient_id})
        })
        let listHolder = {'userid': userId, "ingredients": xd}
        if (checkDuplicates && !checkIngredient && userIngredients.length !== 0) {
            fetch('http://10.0.2.2:8080/api/addOwnedIngredient', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(listHolder)
            }).then(() => {
                this.fetchMyDrinks()
            }).catch((error) => console.error(error))
        } else if (!checkDuplicates) {
            this.errorAlert('Error !', 'Some values are duplicated')
        } else if (checkIngredient) {
            this.errorAlert('Error !', 'Some values are incorrect')
        } else if (userIngredients.length === 0) {
            this.errorAlert('Error !', 'Alcohol table is empty')
        }
    }

    fetchData = () => {
        fetch('http://10.0.2.2:8080/api/getIngredients')
            .then((response) => response.json())
            .then((json) => {
                this.setState({ingredientsList: json})
            })
            .catch((error) => console.error(error))
    }

    changeDrinkSatus = (drinkId, favorite) => {
        if (favorite === true) {
            this.deleteFavoriteDrink(drinkId)
        } else {
            this.addFavoriteDrink(drinkId)
        }
    }

    fetchFavoriteDrinks = () => {
        const {userId, drinksList} = this.state
        fetch('http://10.0.2.2:8080/api/getFavoriteDrink/' + userId)
            .then((response) => response.json())
            .then((json) => {
                let favoriteDrinksList = json
                storeData(JSON.stringify(json), "favoriteDrinks" + userId).then(() => {
                })
                    .then(() => {
                        let finalListHolder = []
                        drinksList.map((item) => {
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
                        this.setState({finalList: finalListHolder, drinksLoaded: true})
                    })
            })
    }

    fetchMyDrinks = () => {
        const {userId} = this.state
        fetch('http://10.0.2.2:8080/api/getDrinksWithOwnedIngredient/' + userId)
            .then((response) => response.json())
            .then((json) => {
                this.setState({drinksList: json})
            })
            .then(() => {
                this.fetchFavoriteDrinks()
            })
            .catch((error) => console.error(error))
    }

    render() {
        const {assetsLoaded, ingredientsList, userIngredients, finalList, drinksLoaded, userId} = this.state
        if (!assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <Provider>
                <View style={styles.container}>
                    <Toolbar navigation={() => {
                        this.props.navigation.goBack()
                    }} text="Your Taste" image='arrow'/>
                    <ScrollView>
                        <View style={{alignContent: 'center'}}>
                            <Text style={{fontSize: 30, textAlign: 'center', color:'white'}}>Owned alcohols</Text>
                            {userIngredients.map((item, key) =>
                                <View key={key} style={styles.specialFavors}>
                                    <Menu
                                        visible={item.visible}
                                        onDismiss={() => {
                                            this.hideIngredientMenu(key)
                                        }}
                                        anchor={<Button style={{alignSelf: 'flex-start', backgroundColor: '#f57e00'}} mode="contained"
                                                        onPress={() => {
                                                            this.showIngredientMenu(key)
                                                        }}>{item.ingredient_name}</Button>}>
                                        {ingredientsList.map((items, keyy) =>
                                            <Menu.Item
                                                onPress={() => this.setDrinkIngredien(items.ingredient_name, items.ingredient_id, key)}
                                                title={items.ingredient_name}
                                                key={keyy}/>
                                        )}
                                    </Menu>
                                    <TouchableOpacity onPress={() => this.removeIngredient(key, item.ingredient_id)}>
                                        <Image style={styles.imageStyle} source={require('../assets/minus.png')}/>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TouchableOpacity style={{alignItems: 'center', marginTop: 15}}
                                              onPress={() => this.addIngredient()}>
                                <Image style={styles.imageStyle} source={require('../assets/add.png')}/>
                            </TouchableOpacity>
                            <Button style={{marginTop: 25, alignSelf: 'center', backgroundColor: '#f57e00'}} mode="contained"
                                    onPress={() => {
                                        this.sendAlcohols()
                                    }}>Save your alcohols</Button>
                        </View>
                        <View>
                            {drinksLoaded && finalList.map((item, key) =>
                                <DrinkShortcutTemplate drinkName={item.name_drink} drinkTaste={item.taste} key={key}
                                                       drinkId={item.id_drink}
                                                       navigation={() => {
                                                           this.props.navigation.navigate("DrinkDetails", {
                                                               id_drink: item.id_drink,
                                                               name_drink: item.name_drink,
                                                               taste: item.taste,
                                                               method: item.method,
                                                               favorite: item.favorite,
                                                               userId: userId,
                                                           })
                                                       }} star={item.favorite}
                                                       changeDrinkStatus={() => this.changeDrinkSatus(item.id_drink, item.favorite)}
                                />)}
                        </View>
                    </ScrollView>
                </View>

            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484848',
    },
    imageStyle: {
        height: 30,
        width: 30,
    },
    specialFavors: {
        borderWidth: 1,
        marginVertical: 10,
        marginHorizontal: 70,
        height: 80,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5f686d'
    },
});

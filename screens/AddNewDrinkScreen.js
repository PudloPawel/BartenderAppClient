import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    Image,
    TextInput,
    TouchableOpacity, Alert
} from 'react-native';
import {Toolbar} from "../components/Toolbar";
import _ from 'lodash'
import {Button, Menu, Provider} from 'react-native-paper';

export default class AddNewDrinkScreen extends React.Component {

    state = {
        visible: false,
        xd: false,
        assetsLoaded: false,
        drinkName: '',
        tastesList: [],
        drinkTaste: 'Choose taste',
        tasteId: 0,
        proportions: _.range(0, 105, 5),
        ingredientsList: [],
        userIngredients: [{
            "ingredient_id": 0,
            "ingredient_name": "Ingredient",
            "proportion": '0',
            "visibleIngredient": false,
            "visibleProportion": false
        }
        ],
        drinkMethod: '',
    }

    errorAlert = (alertText, errorText) =>
        Alert.alert(
            alertText,
            errorText,
            [
                {text: "OK"}
            ]
        );

    successAlert = (alertText, errorText) =>
        Alert.alert(
            alertText,
            errorText,
            [
                {text: "OK", onPress: () => this.props.navigation.goBack()}
            ]
        );

    setDrinkTaste = (taste_name, taste_id) => {
        this.setState({drinkTaste: taste_name, tasteId: taste_id, visible: false})
    }

    setDrinkProportion = (choosenProportion, index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    proportion: choosenProportion,
                    visibleIngredient: item.visibleIngredient,
                    visibleProportion: false
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    setDrinkIngredien = (ingredientName, ingredientId, index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: ingredientId,
                    ingredient_name: ingredientName,
                    proportion: item.proportion,
                    visibleIngredient: false,
                    visibleProportion: item.visibleProportion
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    addIngredient = () => {
        const {userIngredients} = this.state
        let newIngredient = userIngredients
        newIngredient.push({
            ingredient_id: 0,
            ingredient_name: 'ingredient',
            proportion: '0',
            visibleIngredient: false,
            visibleProportion: false
        })
        this.setState({userIngredients: newIngredient})
    }

    showMenu = () => {
        this.setState({visible: true})
    };

    hideMenu = () => {
        this.setState({visible: false})
    }

    showIngredientMenu = (index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    proportion: item.proportion,
                    visibleIngredient: true,
                    visibleProportion: item.visibleProportion
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    showProportionMenu = (index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    proportion: item.proportion,
                    visibleIngredient: item.visibleIngredient,
                    visibleProportion: true
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    componentDidMount() {
        this.fetchData()
    }

    hideIngredientMenu = (index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    proportion: item.proportion,
                    visibleIngredient: false,
                    visibleProportion: item.visibleProportion,
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    hideProportionMenu = (index) => {
        const {userIngredients} = this.state
        let finalListHolder = userIngredients
        userIngredients.map((item, key) => {
            if (key === index) {
                finalListHolder[index] = {
                    ingredient_id: item.ingredient_id,
                    ingredient_name: item.ingredient_name,
                    proportion: item.proportion,
                    visibleIngredient: item.visibleIngredient,
                    visibleProportion: false,
                }
            }
        })
        this.setState({userIngredients: finalListHolder})
    }

    fetchData = () => {
        fetch('http://10.0.2.2:8080/api/getTaste')
            .then((response) => response.json())
            .then((json) => {
                this.setState({tastesList: json})
            })
            .then(() => {
                this.getIngredient()
            })
            .then(() => {
                this.setState({assetsLoaded: true})
            })
            .catch((error) => console.error(error))
    }

    getIngredient = () => {
        fetch('http://10.0.2.2:8080/api/getIngredients')
            .then((response) => response.json())
            .then((json) => {
                this.setState({ingredientsList: json})
            })
            .catch((error) => console.error(error))
    }

    removeIngredient = (index) => {
        const {userIngredients} = this.state
        let newIngredient = userIngredients
        newIngredient.splice(index, 1)
        this.setState({userIngredients: newIngredient})
    }

    sendDrink =() => {
        const {userIngredients, drinkName, drinkMethod, tasteId} = this.state
        let parseredDescription = JSON.stringify(drinkMethod)
        parseredDescription = parseredDescription.replace("\\n", " ")
        parseredDescription = parseredDescription.replace(/"/g,"")
        let checkIngredient = false
        if(_.isEmpty(drinkName) || tasteId === 0 || _.isEmpty(drinkMethod)){
            checkIngredient = true
        }
        let ingredientsHolder = []
        userIngredients.map((item) => {
            if (item.ingredient_id === 0 || item.proportion === '0') {
                checkIngredient = true
            }
            ingredientsHolder.push({'id': item.ingredient_id, 'proportion': item.proportion})
        })
        if(!checkIngredient && userIngredients.length !== 0){
            const data = {
                "drinkName": drinkName,
                "id_taste": tasteId,
                "recipe": ingredientsHolder,
                "method": parseredDescription
            }
            fetch('http://10.0.2.2:8080/api/addDrink', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() =>{
                this.successAlert('Succes !', 'Your drink has been added')
            }).catch((error) => console.error(error))
        }else {
            this.errorAlert('Error !', 'Some fields are blank or invalid')
        }
    }

    render() {
        const {assetsLoaded, tastesList, drinkTaste, ingredientsList, userIngredients, visible, proportions} = this.state
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
                            <Text style={{marginTop: 30, marginLeft: 10, fontSize: 30, color: 'white'}}>Drink name :</Text>
                            <TextInput style={{
                                height: 40,
                                fontSize: 20,
                                marginTop: 25,
                                borderColor: 'white',
                                marginHorizontal: 10,
                                borderBottomWidth: 2,
                                color: 'white'
                            }} maxLength={20}
                                       numberOfLines={1}
                                       placeholderTextColor="#fff"
                                       placeholder="Enter drink name"
                                       onChangeText={(drinkName) => this.setState({drinkName})}/>
                            <Text style={{marginTop: 30, marginLeft: 10, fontSize: 30, color: 'white'}}>Drink taste :</Text>
                            <View style={{alignItems: 'center'}}>
                                <Menu
                                    visible={visible}
                                    onDismiss={() => {
                                        this.hideMenu()
                                    }}
                                    anchor={<Button style={{marginTop: 20, alignSelf: 'center', backgroundColor: '#f57e00'}} mode="contained"
                                                    onPress={() => {
                                                        this.showMenu()
                                                    }}>{drinkTaste}</Button>}>
                                    {tastesList.map((item, key) =>
                                        <Menu.Item onPress={() => this.setDrinkTaste(item.name, item.id)}
                                                   title={item.name}
                                                   key={key}/>
                                    )}
                                </Menu>
                            </View>
                            <Text style={{marginTop: 30, marginLeft: 10, fontSize: 30, color: 'white'}}>Drink ingredients :</Text>
                            {userIngredients.map((item, key) =>
                                <View key={key} style={styles.specialFavors}>
                                    <View>
                                        <Menu
                                            style={{marginTop: 20}}
                                            visible={item.visibleIngredient}
                                            onDismiss={() => {
                                                this.hideIngredientMenu(key)
                                            }}
                                            anchor={<Button style={{backgroundColor: '#f57e00'}} mode="contained" onPress={() => {
                                                this.showIngredientMenu(key)
                                            }}>{item.ingredient_name}</Button>}>
                                            {ingredientsList.map((items, keyy) =>
                                                <Menu.Item
                                                    onPress={() => this.setDrinkIngredien(items.ingredient_name, items.ingredient_id, key)}
                                                    title={items.ingredient_name}
                                                    key={keyy}/>
                                            )}
                                        </Menu>
                                    </View>
                                    <View>
                                        <Menu
                                            style={{marginTop: 20}}
                                            visible={item.visibleProportion}
                                            onDismiss={() => {
                                                this.hideProportionMenu(key)
                                            }}
                                            anchor={<Button style={{backgroundColor: '#f57e00'}}mode="contained" onPress={() => {
                                                this.showProportionMenu(key)
                                            }}>{item.proportion} ml</Button>}>
                                            {proportions.map((itemsProp, keyy) =>
                                                <Menu.Item
                                                    onPress={() => this.setDrinkProportion(itemsProp, key)}
                                                    title={itemsProp}
                                                    key={keyy}/>
                                            )}
                                        </Menu>
                                    </View>
                                    <TouchableOpacity onPress={() => this.removeIngredient(key)}>
                                        <Image style={styles.imageStyle} source={require('../assets/minus.png')}/>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TouchableOpacity style={{alignItems: 'center', marginTop: 15, alignSelf: 'center'}}
                                              onPress={() => this.addIngredient()}>
                                <Image style={styles.imageStyle} source={require('../assets/add.png')}/>
                            </TouchableOpacity>
                            <Text style={{marginTop: 30, marginLeft: 10, fontSize: 30, color: 'white'}}>Drink method :</Text>
                            <TextInput style={{
                                height: 40,
                                fontSize: 20,
                                marginTop: 25,
                                borderColor: 'white',
                                marginBottom: 20,
                                marginHorizontal: 10,
                                borderBottomWidth: 2,
                                color: 'white'
                            }}
                                       multiline numberOfLines={4}
                                       placeholderTextColor="#fff"
                                       placeholder="Enter liquor desciption"
                                       onChangeText={(drinkMethod) => this.setState({drinkMethod})}/>
                            <Button style={{marginVertical: 25, alignSelf: 'center', backgroundColor: '#f57e00'}} mode="contained"
                                    onPress={() =>
                                        this.sendDrink()
                                    }>Save your alcohols</Button>
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
        marginHorizontal: 20,
        height: 80,
        borderColor: 'red',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center'
    },

});

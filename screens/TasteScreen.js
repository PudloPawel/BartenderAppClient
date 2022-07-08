import React from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {getData, storeData} from "../utils/Storage";
import {DrinkShortcutTemplate} from "../components/DrinkShortcutTemplate"
import {Toolbar} from "../components/Toolbar";

export default class TasteScreen extends React.Component {

    state = {
        drinksList: [],
        drinksLoaded: false,
        assetsLoaded: false,
        tastesList: [],
        userId: 0,
        finalList: []
    }

    componentDidMount() {
        getData("userId").then(r => {
            if(r !== undefined) {
                let idHandler = (JSON.parse(r))
                idHandler = Number(idHandler)
                this.setState({userId: idHandler})
            }
        }).then(() =>{
            this.getTastes()
        })
    }

    chooseTaste = (taste) => {
        this.fetchDrinks(taste)
    }

    getTastes = () => {
        fetch('http://10.0.2.2:8080/api/getTaste')
            .then((response) => response.json())
            .then((json) => {
                let specialFavor = []
                json.map((item) => {
                    if (item.name !== 'Sweet' && item.name !== 'Sour' && item.name !== 'Dry')
                        specialFavor.push(item.name)
                })
                this.setState({tastesList: specialFavor})
            })
            .then(() => {
                this.setState({assetsLoaded: true})
            })
            .catch((error) => console.error(error))
    }

    fetchDrinks = (taste) => {
        const {userId} = this.state
        let ids = []
        let filtredDrinks = []
        fetch('http://10.0.2.2:8080/api/getDrinks')
            .then((response) => response.json())
            .then((json) => {
                json.map((item) => {
                    if (item.taste === taste) {
                        filtredDrinks.push(item)
                    }
                })
                storeData(JSON.stringify(json), "drinksByTaste" + userId).then(() => {
                    this.setState({drinksList: filtredDrinks})
                })
                ids = json.map((item) => item.id_drink)
            })
            .then(() => {
                this.fetchSimpleDrink(ids)
            })
            .then(() => {
                this.fetchFavoriteDrinks(filtredDrinks)
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

    fetchFavoriteDrinks = (filtredDrinks) => {
        const {userId} = this.state
        fetch('http://10.0.2.2:8080/api/getFavoriteDrink/' + userId)
            .then((response) => response.json())
            .then((json) => {
                let favoriteDrinksList = json
                storeData(JSON.stringify(json), "favoriteDrinks" + userId).then(() => {
                })
                    .then(() => {
                        let finalListHolder = []
                        filtredDrinks.map((item) => {
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

    changeDrinkSatus = (drinkId, favorite) => {
        if (favorite === true) {
            this.deleteFavoriteDrink(drinkId)
        } else {
            this.addFavoriteDrink(drinkId)
        }
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


    render() {
        const {assetsLoaded, drinksLoaded, tastesList, finalList} = this.state;
        if (!assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <View style={styles.container}>
                <Toolbar navigation={() => {
                    this.props.navigation.goBack()
                }} text="Your Taste" image='arrow'/>
                <ScrollView>
                    <View style={{alignContent: 'center'}}>
                        <Text style={{fontSize: 30, textAlign: 'center', color: 'white'}}>Basic Tastes</Text>
                        <View style={styles.rowDirect}>
                            <TouchableOpacity onPress={() => this.chooseTaste("Sweet")} style={styles.mainTastes}>
                                <Text style={{fontSize: 20, color: 'white'}}>Sweet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.chooseTaste("Sour")} style={styles.mainTastes}>
                                <Text style={{fontSize: 20, color: 'white'}}>Sour</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.chooseTaste("Dry")} style={styles.mainTastes}>
                                <Text style={{fontSize: 20, color: 'white'}}>Dry</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: 30, textAlign: 'center', marginTop: 20, color: 'white'}}>Special flavor</Text>
                            <View style={{height: 175, borderWidth: 1, marginHorizontal: 20, borderColor: '#C41C00'}}>
                                <ScrollView>
                                {tastesList.map((item, key) => {
                                    return (
                                        <TouchableOpacity onPress={() => this.chooseTaste(item.toString())} key={key}
                                                          style={styles.specialFavorsButton}>
                                            <Text style={{ alignSelf: 'center', textAlign: 'center', marginTop: 20, color: 'white'}}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                                </ScrollView>
                            </View>
                        <ScrollView style={{marginTop: 30}}>
                            <View>
                                {drinksLoaded && (finalList.map((item, key) =>
                                    <DrinkShortcutTemplate drinkName={item.name_drink} drinkTaste={item.taste} key={key}
                                                           drinkId={item.id_drink}
                                                           navigation={() => {
                                                               this.props.navigation.navigate("DrinkDetails", {
                                                                   id_drink: item.id_drink, name_drink: item.name_drink,
                                                                   taste: item.taste, method: item.method, favorite:item.favorite,
                                                                   userId: this.state.userId
                                                               })
                                                           }} star={item.favorite}
                                                           changeDrinkStatus={() => this.changeDrinkSatus(item.id_drink, item.favorite)}
                                    />))}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484848',
    },
    rowDirect: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    mainTastes: {
        borderWidth: 1,
        marginVertical: 20,
        marginHorizontal: 10,
        borderColor: 'red',
        backgroundColor: '#5f686d',
        width: 80,
        height: 70,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    specialFavors: {
        borderWidth: 1,
        marginVertical: 30,
        marginHorizontal: 20,
        borderColor: 'red',
        height: 250,
    },
    specialFavorsButton: {
        borderWidth: 1,
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5f686d',
    }

});

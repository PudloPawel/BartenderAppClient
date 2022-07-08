import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    RefreshControl,
    ActivityIndicator,
    Image,
    Text,
    Button
} from 'react-native';
import {storeData, getData} from "../utils/Storage";
import {DrinkShortcutTemplate} from "../components/DrinkShortcutTemplate"
import {Toolbar} from "../components/Toolbar";

export default class HomeScreen extends React.Component {

    state = {
        drinksList: {},
        finalList: [],
        assetsLoaded: false,
        userRange: 0,
        userId: 0,
        userName: '',
        refreshing: false,
        loginVisible: true
    }

    componentDidMount() {
        getData("showScreen").then(r => {
            if (r !== undefined) {
                this.setState({loginVisible: false, assetsLoaded: true,})
                this.getStorage()
            } else {
                this.setState({loginVisible: true, assetsLoaded: true,})
            }
        })
    }

    getStorage = () => {
        getData("drinks").then(r => {
            if (r !== undefined) {
                this.setState({drinksList: (JSON.parse(r))})
            }
        })
            .then(() => {
                getData("userId").then(r => {
                    if (r !== undefined) {
                        let idHandler = (JSON.parse(r))
                        idHandler = Number(idHandler)
                        this.setState({userId: idHandler})
                    }
                })
            }).then(() => {
                getData("userRange").then(r => {
                    if (r !== "undefined") {
                        this.setState({userRange: r})
                    }
                }).then(() => {
                    this.fetchData()
                }).then(() => {
                    this.setState({assetsLoaded: true, loginVisible: false})
                }).catch((error) => console.error(error))
            }
        )
    }

    showScreem = () => {
        storeData(JSON.stringify(true), "showScreen").then(() => {
            this.getStorage()
        })
    }

    fetchData = () => {
        let ids = []
        fetch('http://10.0.2.2:8080/api/getDrinks')
            .then((response) => response.json())
            .then((json) => {
                storeData(JSON.stringify(json), "drinks").then(() => {
                    this.setState({drinksList: json,})
                })
                ids = json.map((item) => item.id_drink)
            })
            .then(() => {
                this.fetchSimpleDrink(ids)
            })
            .then(() => {
                this.fetchFavoriteDrinks()
            })
            .then(() => {
                this.fetchUserRange()
            })
            .then(() => {
                this.setState({assetsLoaded: true})
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
                        this.setState({finalList: finalListHolder})
                    })
            })
    }

    fetchUserRange = () => {
        fetch('http://10.0.2.2:8080/api/getRange/' + this.state.userId)
            .then((response) => response.json())
            .then((json) => {
                storeData(JSON.stringify(json.range), "userRange").then(r => {
                    this.setState({userRange: json.range})
                })
            })
            .catch((error) => console.error(error))
    }

    onRefresh = () => {
        this.setState({refreshing: true})
        this.wait(500).then(() => {
            this.fetchData()
            this.setState({refreshing: false})
        })
    }

    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
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
        const {finalList, assetsLoaded, userId} = this.state;
        if (!assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <View style={styles.container}>
                <Toolbar navigation={() => {
                    this.props.navigation.openDrawer()
                }} text="Home" image='menu'/>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}>
                    <View>
                        {this.state.loginVisible && <View style={styles.modalView}>
                            <Image style={styles.imageStyle} source={require('../assets/liquor.png')}/>
                            <Text style={{fontSize: 50, color: 'white', marginTop: 100, marginBottom: 30}}>Welcome !</Text>
                            <Button color={'#f57e00'} title="Have fun" onPress={() => this.showScreem()}/>
                        </View>}
                        {finalList.map((item, key) =>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484848',
        justifyContent: 'center',
    },
    modalView: {
        backgroundColor: "#484848",
        padding: 50,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    imageStyle: {
        height: 200,
        width: 150,
    }
});

import React from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {DrinkShortcutTemplate} from "../components/DrinkShortcutTemplate"
import {Toolbar} from "../components/Toolbar";
import {getData, storeData} from "../utils/Storage";

export default class FavoriteDrinkScreen extends React.Component {

    state = {
        drinksList: [],
        assetsLoaded: false,
        tastesList: [],
        userId: 0
    }

    componentDidMount() {
        getData("userId").then(r => {
            if (r !== undefined) {
                let id = (JSON.parse(r))
                this.setState({userId: id})
            }
        }).then(() => {
            this.fetchDrinks()
        })
    }

    fetchDrinks = () => {
        const {userId} = this.state
        fetch('http://10.0.2.2:8080/api/getFavoriteDrink/' + userId)
            .then((response) => response.json())
            .then((json) => {
                storeData(JSON.stringify(json), "favoriteDrinks" + userId).then(() => {
                    this.setState({drinksList: json})
                })
            })
            .then(() => {
                this.setState({assetsLoaded: true})
            })
            .catch((error) => console.error(error))
    }

    deleteFavoriteDrink = (drinkId) => {
        const {userId, drinksList} = this.state
        fetch('http://10.0.2.2:8080/api/deleteFavoriteDrink?user_id=' + userId + '&drink_id=' + drinkId, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        }).then(() => {
            let removedIndex = 0
            drinksList.map((item) => {
                if (item.id_drink === drinkId) {
                    removedIndex = drinksList.indexOf(item)
                }
            })
            let newList = drinksList.filter((drinksList, index) => removedIndex !== index)
            this.setState({drinksList: newList})
        }).catch((error) => console.error(error))
    }

    render() {
        const {drinksList, assetsLoaded, userId} = this.state;
        if (!assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <View style={styles.container}>
                <Toolbar navigation={() => {
                    this.props.navigation.goBack()
                }} text="Your Favorite Drinks" image='arrow'/>
                <ScrollView>
                    <View style={{alignContent: 'center'}}>
                        <Text style={{fontSize: 30, textAlign: 'center', color: 'white'}}>Your favorite Drinks</Text>
                        <View>
                            {drinksList.map((item, key) =>
                                <DrinkShortcutTemplate drinkName={item.name_drink} drinkTaste={item.taste} key={key}
                                                       drinkId={item.id_drink}
                                                       navigation={() => {
                                                           this.props.navigation.navigate("DrinkDetails", {
                                                               id_drink: item.id_drink, name_drink: item.name_drink,
                                                               taste: item.taste, method: item.method, favorite: true,
                                                               userId: userId,
                                                           })
                                                       }} star={true}
                                                       changeDrinkStatus={() => this.deleteFavoriteDrink(item.id_drink)}
                                />)}
                        </View>
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
});

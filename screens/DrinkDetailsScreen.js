import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity} from 'react-native';
import {getData} from "../utils/Storage";
import {Toolbar} from "../components/Toolbar";
import {DrinkIngredientsTemplate} from "../components/DrinkIngredientsTemplate"

export default class HomeScreen extends React.Component {

    state = {
        assetsLoaded: false,
        id_drink: this.props.route.params.id_drink,
        name_drink: this.props.route.params.name_drink,
        taste: this.props.route.params.taste,
        method: this.props.route.params.method,
        favorite: this.props.route.params.favorite,
        userId: this.props.route.params.userId,
        ingredientsList: {
        },
        ingredientsNames: [],
        ingredientsPropotions: [],
        ingredientsPercent: [],
    }

    componentDidMount() {
        this.setState({assetsLoaded: false})
        this.getIngredients()
    }

    getIngredients = () => {
        getData("Drink" + this.props.route.params.id_drink).then(r => {
            // console.log(JSON.parse(r))
            this.setState({
                    ingredientsList: JSON.parse(r)
                },
            )
        })
            .then(() => {
                let ingNames = this.state.ingredientsList.map((item) => item.ingredient_name)
                let ingProp = this.state.ingredientsList.map((item) => item.proportion)
                let ingPerc = this.state.ingredientsList.map((item) => item.perecent)
                this.setState({
                    ingredientsNames: ingNames,
                    ingredientsPropotions: ingProp,
                    ingredientsPercent: ingPerc,
                })
            })
            .then(() => {
                this.setState({assetsLoaded: true})
            })
    }

    addFavoriteDrink = () => {
        const {userId, id_drink} = this.state
        fetch('http://10.0.2.2:8080/api/addFavoriteDrink?user_id=' + userId + '&drink_id=' + id_drink, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        }).then(() => {
            this.setState({favorite: true})
        }).catch((error) => console.error(error))
    }

    deleteFavoriteDrink = () => {
        const {userId, id_drink} = this.state
        fetch('http://10.0.2.2:8080/api/deleteFavoriteDrink?user_id=' + userId + '&drink_id=' + id_drink, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        }).then(() => {
            this.setState({favorite: false})
        }).catch((error) => console.error(error))
    }

    render() {
        const {assetsLoaded} = this.state
        if (!assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <View style={styles.container}>
                <Toolbar navigation={() => {
                    this.props.navigation.goBack()
                }} text="Drink Details" image='arrow'/>
                <View style={styles.rowDirect}>
                    <Text style={styles.drinkName}>{this.props.route.params.name_drink}</Text>
                    {this.state.favorite  === true && <TouchableOpacity onPress={ () => this.deleteFavoriteDrink()}>
                        <Image style={styles.imageStyle} source={require('../assets/yellow_star.png')}/>
                    </TouchableOpacity>}
                    {this.state.favorite  === false && <TouchableOpacity onPress={ () => this.addFavoriteDrink()}>
                        <Image style={styles.imageStyle} source={require('../assets/star_border.png')}/>
                    </TouchableOpacity>}
                </View>
                <Text style={styles.drinkTaste}>{"#" + this.props.route.params.taste}</Text>
                <ScrollView>
                    <DrinkIngredientsTemplate ingredientsNames={this.state.ingredientsNames}
                                              ingredientsProportion={this.state.ingredientsPropotions}
                                              ingredientsPercentage={this.state.ingredientsPercent}/>
                </ScrollView>
                <Text style={{fontSize: 30,  color: 'white', textAlign: 'center', marginBottom: 10}}>Mixing method</Text>
                <View style={styles.getResultView}>
                    <Text style={styles.answerText}>{this.props.route.params.method}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484848',
        justifyContent: 'center',
    },
    rowDirect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        alignItems: 'center',
    },
    imageStyle: {
        height: 30,
        width: 30,
        marginEnd: 15
    },
    drinkTaste: {
        fontSize: 15,
        marginBottom: 20,
        textAlign: 'left',
        marginStart: 15,
        color: '#f57e00',
        paddingHorizontal: 10,
    },
    drinkName: {
        fontSize: 30,
        textAlign: 'left',
        marginTop: 10,
        color: 'white',
        marginBottom: 20,
        marginStart: 20,
    },

    getResultView: {
        flex: 10,
        backgroundColor: '#5f686d',
        marginBottom: 25,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    answerText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
});

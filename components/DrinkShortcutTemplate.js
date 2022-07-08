import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View, Image} from 'react-native';

const DrinkShortcutTemplate = (props) => {
    const {drinkName, drinkTaste, navigation, star, changeDrinkStatus} = props

    return (
        <View>
            <TouchableOpacity style={styles.testView} onPress={navigation}>
                <View style={styles.rowDirect}>
                    <Text style={styles.drinkName}>{drinkName}</Text>
                    {star === true && <TouchableOpacity onPress={changeDrinkStatus}>
                        <Image style={styles.imageStyle} source={require('../assets/yellow_star.png')}/>
                    </TouchableOpacity>}
                    {star === false && <TouchableOpacity onPress={changeDrinkStatus}>
                        <Image style={styles.imageStyle} source={require('../assets/star_border.png')}/>
                    </TouchableOpacity>}

                </View>
                <Text style={styles.drinkTaste}>{"#" + drinkTaste}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    testView: {
        borderWidth: 1,
        marginVertical: 20,
        marginHorizontal: 10,
        borderColor: '#C41C00',
        backgroundColor: '#5f686d',
        borderRadius: 5
    },
    drinkName: {
        fontSize: 30,
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 20,
        marginStart: 20,
        color: 'white'
    },
    drinkTaste: {
        fontSize: 15,
        marginBottom: 20,
        textAlign: 'left',
        marginStart: 15,
        color: '#f57e00',
        paddingHorizontal: 10,
    },
    rowDirect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        alignItems: 'center'
    },
    imageStyle: {
        height: 30,
        width: 30,
        marginEnd: 15
    }
})

export {DrinkShortcutTemplate};

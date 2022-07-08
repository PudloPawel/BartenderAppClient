import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

const DrinkIngredientsTemplate = (props) => {
    const {ingredientsNames, ingredientsProportion, ingredientsPercentage} = props
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <View style={styles.rowDirect}>
                {ingredientsNames.map((item, key) =>
                    <Text style={styles.textStyle} key={key}>{item}</Text>
                )}
            </View>
            <View style={styles.rowDirect}>
                {ingredientsProportion.map((item, key) =>
                    <Text style={styles.textStyle} key={key}>{item + 'ml'}</Text>
                )}
            </View>
            <View style={styles.rowDirect}>
                {ingredientsPercentage.map((item, key) =>
                    <Text style={styles.textStyle} key={key}>{item + '%'}</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowDirect: {
        flexDirection: 'column',
        marginVertical: 30,
        marginHorizontal: 20,
        textAlign: 'center',
    },
    textStyle: {
        fontSize: 25,
        color: 'white'
    },
})

export {DrinkIngredientsTemplate};

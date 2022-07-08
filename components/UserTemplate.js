import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';

const UserTemplate = (props) => {
    const {usersNicknames, usersIds, changeUserRange, button} = props

    return (
        <View style={styles.containter}>
            <View style={styles.columnDirect}>
                    <Text style={styles.textStyle} >User Id: {usersIds}</Text>
            </View>
            <View style={styles.columnDirect}>
                    <Text   maxLength = {8} style={styles.textStyle}>User name: {usersNicknames}</Text>
            </View>
            <View style={styles.columnDirect}>
                    <TouchableOpacity  onPress={changeUserRange}>
                        {button === 'plus' && <Image style={styles.imageStyle} source={require('../assets/add.png')}/>}
                        {button === 'minus' && <Image style={styles.imageStyle} source={require('../assets/minus.png')}/>}
                    </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        backgroundColor: '#5f686d',
        borderColor: '#C41C00'
    },
    columnDirect: {
        flexDirection: 'column',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    textStyle: {
        fontSize: 17,
        color: 'white'
    },
    imageStyle: {
        height: 30,
        width: 30,
    }
})

export {UserTemplate};

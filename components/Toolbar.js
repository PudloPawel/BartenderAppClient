import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';

const Toolbar = (props) => {
    const { navigation, image } = props
    return(
        <View style={styles.toolbarView}>
            <TouchableOpacity style={styles.toolbarButton} onPress={navigation}>
                {image === 'menu' && <Image style={styles.imageStyle} source={require('../assets/menu.png')}/>}
                {image === 'arrow' && <Image style={styles.imageStyle} source={require('../assets/left-arrow.png')}/>}
            </TouchableOpacity>
            <Text style={styles.toolbarText}>My Coctail App</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    toolbarView:{
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FF5722',
    },
    toolbarText:{
        marginStart: 65,
        fontSize: 27,
        color: 'white'
    },
    toolbarButton:{
        marginTop: 35,
        marginLeft: 10,
    },
    imageStyle: {
        height: 50,
        width: 50,
    }
})

export {Toolbar};

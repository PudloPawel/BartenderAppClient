import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem,} from '@react-navigation/drawer';
import HomeScreen from "../screens/HomeScreen";
import DrinkDetailsScreen from "../screens/DrinkDetailsScreen";
import AddNewDrinkScreen from "../screens/AddNewDrinkScreen";
import TasteScreen from "../screens/TasteScreen";
import AdminPanel from "../screens/AdminPanel";
import AddNewLiquorScreen from "../screens/AddNewLiquorScreen";
import FavoriteDrinkScreen from "../screens/FavoriteDrinkScreen";
import MyAlcoholsScreen from "../screens/MyAlcoholsScreen";

const Drawer = createDrawerNavigator();

const CustomDrawerItems = (props) => {
    const {range} = props
    return (
        <Drawer.Navigator
            drawerStyle={{
                backgroundColor: '#323232',
            }}
            initialRouteName="Home"
            drawerContent={(props) => {
                switch (range) {
                    case 2:
                        return (
                            <DrawerContentScrollView {...props}>
                                <View style={styles.appNameView}>
                                    <Image style={styles.imageStyle} source={require('../assets/liquor.png')}/>
                                </View>
                                <DrawerItem label={"My alcohols"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('MyAlcohols')}/>
                                <DrawerItem label={"Taste"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('Taste')}/>
                                <DrawerItem label={"Favourite drinks"} labelStyle={{color: 'white'}}
                                            onPress={() => props.navigation.navigate('FavoriteDrinks')}/>
                            </DrawerContentScrollView>
                        );
                    case 1:
                        return (
                            <DrawerContentScrollView {...props}>
                                <View style={styles.appNameView}>
                                    <Image style={styles.imageStyle} source={require('../assets/liquor.png')}/>
                                </View>
                                <DrawerItem label={"My alcohols"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('MyAlcohols')}/>
                                <DrawerItem label={"Taste"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('Taste')}/>
                                <DrawerItem label={"Favourite drinks"} labelStyle={{color: 'white'}}
                                            onPress={() => props.navigation.navigate('FavoriteDrinks')}/>
                                    <DrawerItem label={"Add new drink"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('AddNewDrink')}/>
                                <DrawerItem label={"Add new liquor"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('AddNewLiquor')}/>
                            </DrawerContentScrollView>
                        );
                    case 0:
                        return (
                            <DrawerContentScrollView {...props}>
                                <View style={styles.appNameView}>
                                    <Image style={styles.imageStyle} source={require('../assets/liquor.png')}/>
                                </View>
                                <DrawerItem label={"My alcohols"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('MyAlcohols')}/>
                                <DrawerItem label={"Taste"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('Taste')}/>
                                <DrawerItem label={"Favourite drinks"} labelStyle={{color: 'white'}}
                                            onPress={() => props.navigation.navigate('FavoriteDrinks')}/>
                                <DrawerItem label={"Add new drink"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('AddNewDrink')}/>
                                <DrawerItem label={"Add new liquor"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('AddNewLiquor')}/>
                                <DrawerItem label={"Admin panel"} labelStyle={{color: 'white'}} onPress={() => props.navigation.navigate('Admin')}/>
                            </DrawerContentScrollView>
                        );
                }
            }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="DrinkDetails" component={DrinkDetailsScreen} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="AddNewDrink" component={AddNewDrinkScreen} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="Taste" component={TasteScreen} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="Admin" component={AdminPanel} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="AddNewLiquor" component={AddNewLiquorScreen} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="FavoriteDrinks" component={FavoriteDrinkScreen} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="MyAlcohols" component={MyAlcoholsScreen} options={{unmountOnBlur: true}}/>
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    appNameView: {
        height: 160,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#292929',
    },
    imageStyle: {
        width: 150,
        height: 150
    },
});

export {CustomDrawerItems};

import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    ScrollView, Button, Alert
} from 'react-native';
import _ from 'lodash'
import {Toolbar} from "../components/Toolbar";


export default class TasteScreen extends React.Component {

    state = {
        liquorName: '',
        liquorPercentage: '',
        liquorDescription: '',
        pattern: /[a-zA-Z]+/,
        validation: false,
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

    fieldValidatior = () => {
        const {liquorName, liquorPercentage, liquorDescription, pattern} = this.state
        if ((_.isEmpty(liquorName) || !pattern.test(liquorName)) || _.isEmpty(liquorDescription) || _.isEmpty(liquorPercentage)) {
            return false
        } else if (!_.isEmpty(liquorPercentage)) {
            let percentageInt = _.parseInt(liquorPercentage)
            if (percentageInt > 100 || percentageInt < 0) {
                return false
            } else {
                return true
            }
        }
    }

    AddNewLiquod = () => {
        const {liquorName, liquorPercentage} = this.state
        let parseredDescription = JSON.stringify(this.state.liquorDescription)
        parseredDescription = parseredDescription.replace("\\n", " ")
        parseredDescription = parseredDescription.replace(/"/g,"")
        let validator = this.fieldValidatior()
        if(validator === false){
            this.errorAlert('Error !', 'Some fields are blank or invalid')
        }else {
            fetch('http://10.0.2.2:8080/api/addIngredient?name=' + liquorName + "&percent=" + liquorPercentage + "&description=" + parseredDescription, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: ''
            }).then(() =>{
                this.successAlert('Succes !', 'Your liquor has been added')
            }).catch((error) => console.error(error))
        }
    }

    render() {
        const {} = this.state;
        return (
            <View style={styles.container}>
                <Toolbar navigation={() => {
                    this.props.navigation.goBack()
                }} text="Add new liquor" image='arrow'/>
                <ScrollView>
                    <View>
                        <Text style={{fontSize: 30, marginLeft: 10, marginVertical: 35, color: 'white'}}>Liquor name :</Text>
                        <TextInput style={{
                            height: 40,
                            fontSize: 20,
                            marginTop: 25,
                            color: 'white',
                            marginHorizontal: 10,
                            borderBottomWidth: 2
                        }} maxLength={40}
                                   numberOfLines={1}
                                   placeholder="Enter liquor name"
                                   placeholderTextColor="#fff"
                                   onChangeText={(liquorName) => this.setState({liquorName})}/>
                        <Text style={{fontSize: 30, marginLeft: 10, marginVertical: 35, color: 'white'}}>Liquor percentage (0-100%)
                            :</Text>
                        <TextInput style={{
                            height: 40,
                            fontSize: 20,
                            marginTop: 25,
                            color: 'white',
                            marginHorizontal: 10,
                            borderBottomWidth: 2
                        }} maxLength={40}
                                   numberOfLines={1}
                                   keyboardType={'numeric'}
                                   placeholderTextColor="#fff"
                                   placeholder="Enter liquor percentage"
                                   onChangeText={(liquorPercentage) => this.setState({liquorPercentage})}/>
                        <Text style={{fontSize: 30, marginLeft: 10, marginVertical: 35, color: 'white'}}>Liquor description :</Text>
                        <TextInput style={{
                            height: 40,
                            fontSize: 20,
                            marginTop: 25,
                            color: 'white',
                            marginBottom: 20,
                            marginHorizontal: 10,
                            borderBottomWidth: 2
                        }}
                                   multiline numberOfLines={4}
                                   placeholderTextColor="#fff"
                                   placeholder="Enter liquor desciption"
                                   onChangeText={(liquorDescription) => this.setState({liquorDescription})}/>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                            <Button color={'#f57e00'} title="Send liquor" onPress={() => this.AddNewLiquod()}/>
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
        justifyContent: 'center',
    },
});

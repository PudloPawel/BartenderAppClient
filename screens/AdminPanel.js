import React from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import {Toolbar} from "../components/Toolbar";
import _ from 'lodash'
import {UserTemplate} from "../components/UserTemplate";

export default class TasteScreen extends React.Component {

    state = {
        normalUsers: [],
        premiumUsers: [],
        assetsLoaded: false,
        refreshing: false,
    }

    componentDidMount() {
        this.getUsers()
    }

    getUsers = () => {
        fetch('http://10.0.2.2:8080/api/getUsers')
            .then((response) => response.json())
            .then((json) => {
                let normalUsers = _.filter(json, {'range': 0})
                let premiumUsers = _.filter(json, {'range': 1})
                this.setState({
                    normalUsers: normalUsers,
                    premiumUsers: premiumUsers
                })
            })
            .then(() => {
                this.setState({assetsLoaded: true})
            })
            .catch((error) => console.error(error))
    }

    changeRange = (userID) => {
        fetch('http://10.0.2.2:8080/api/setRange/' + userID, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        }).then(() =>{
            this.onRefresh()
        }).catch((error) => console.error(error))
    }

    onRefresh = () => {
        this.setState({refreshing: true})
        this.wait(500).then(() => {
            this.getUsers()
            this.setState({refreshing: false})
        })
    }

    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    render() {
        const {normalUsers, premiumUsers, assetsLoaded} = this.state;
        if (!assetsLoaded) {
            return <ActivityIndicator/>;
        }
        return (
            <View style={styles.container}>
                <Toolbar navigation={() => {
                    this.props.navigation.goBack()
                }} text="Your Taste" image='arrow'/>
                <ScrollView>
                    <View>
                        <Text style={{fontSize: 30, textAlign: 'center', marginVertical: 35, color: 'white'}}>Normal Users :</Text>
                        <View style={{height: 175, borderWidth: 1, marginHorizontal: 20, borderColor: '#C41C00'}}>
                            <ScrollView>
                                {normalUsers.map((item, key) => {
                                    return (<UserTemplate key={key} usersNicknames={item.nick}
                                                          usersIds={item.user_id}
                                                          changeUserRange={() => this.changeRange(item.user_id)} button={'plus'}/>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        <View>
                            <Text style={{fontSize: 30, textAlign: 'center', marginVertical: 35, color: 'white'}}>Premium Users :</Text>
                            <View style={{height: 175, borderWidth: 1, marginHorizontal: 20, borderColor: '#C41C00',}}>
                                <ScrollView>
                                    {premiumUsers.map((item, key) => {
                                        return (<UserTemplate key={key} usersNicknames={item.nick}
                                                              usersIds={item.user_id}
                                                              changeUserRange={() => this.changeRange(item.user_id)} button={'minus'}/>
                                        )
                                    })}
                                </ScrollView>
                            </View>
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

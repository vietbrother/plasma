/**
 * This is the contact page
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Container, View, Icon, Left, Button, Item, Input} from 'native-base';
import {Actions} from 'react-native-router-flux';

// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Colors from '../Colors';
import Config from '../Config';
import {Linking} from "react-native";

export default class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            subject: '',
            message: ''
        }
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button transparent onPress={() => Actions.pop()}>
                    <Icon name="ios-close" size={38} style={{fontSize: 38}}/>
                </Button>
            </Left>
        );
        return (
            <Container style={{backgroundColor: '#fdfdfd'}}>
                <Navbar left={left} title="Liên hệ"/>
                <View style={{
                    flex: 1,
                    // justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
                    // paddingLeft: 50,
                    // paddingRight: 50
                }}>
                    <Item>
                        <Icon active name='ios-call'/>
                        {/*<Text>Hotline : {Config.hotline}</Text>*/}
                        <Text>Hotline : <Text style={{
                            color: "#c0392b",
                            fontSize: 20,
                        }}>{Config.hotline}</Text></Text>
                    </Item>
                    <Item>
                        <Icon style={{fontSize: 18}} name='logo-facebook'
                              onPress={() => Linking.openURL('http://www.facebook.com/').catch(err => console.error('An error occurred', err))}/>
                        <Text
                            onPress={() => Linking.openURL('http://www.facebook.com/').catch(err => console.error('An error occurred', err))}>
                            Fanpage : http://www.facebook.com/onni</Text>
                    </Item>

                </View>
            </Container>
        );
    }

    send() {
        alert('Send email');
    }
}

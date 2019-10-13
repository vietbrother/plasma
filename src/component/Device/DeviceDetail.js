/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableWithoutFeedback, AsyncStorage} from 'react-native';
import {
    View,
    Container,
    Content,
    Button,
    Left,
    Right,
    Icon,
    Picker,
    Item,
    Grid,
    Col,
    Toast,
    Text as NBText,
    List, ListItem,
    Card, CardItem,
    DatePicker,
    Body, Input
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Carousel, {Pagination} from 'react-native-snap-carousel';

// Our custom files and classes import
import Config from '../../Config';
import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import Spinner from 'react-native-loading-spinner-overlay';


export default class DeviceDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorText: '',
            isLoading: false,

            code: '',
            stage: '',
            warehouse: '',
            p_customer: [],
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setState({
            code: this.props.device.code,
            stage: this.props.device.stage,
            warehouse: this.props.device.warehouse,
            p_customer: this.props.device.p_customer,
        });
        console.log(this.state.p_customer);
    }

    _renderCodeProducts(code) {
        let temp = code.replace(new RegExp(this.state.searchText, "gi"), (match) => `<b style="color: dodgerblue">${match}</b>`);
        return temp;
    }

    _renderStatus(status) {
        if (status == '0') {
            return (<Text style={{color: '#ffa505'}}>
                <Icon name="ios-help-circle-outline"
                      style={{fontSize: 13, color: '#ffa505'}}/>
                {Config.stageName0KhongXacDinh}</Text>);
        } else if (status == '4') {
            return (<Text style={{color: '#44bc37'}}>
                <Icon name="ios-checkmark-circle"
                      style={{fontSize: 13, color: '#44bc37'}}/>
                {Config.stageName4BinhDangSuDung} </Text>);
        } else if (status == '1') {
            return (<Text style={{color: Config.colorThin}}>
                <Icon name="ios-battery-dead"
                      style={{fontSize: 13, color: Config.colorThin}}/>
                {Config.stageName1Vo} </Text>);
        } else if (status == '2') {
            return (<Text style={{color: '#ff00ff'}}>
                <Icon name="ios-refresh-circle"
                      style={{fontSize: 13, color: '#ff00ff'}}/>
                {Config.stageName2TaiNap} </Text>);
        } else if (status == '3') {
            return (<Text style={{color: '#c40521'}}>
                <Icon name="ios-warning"
                      style={{fontSize: 13, color: '#c40521'}}/>
                {Config.stageName3BinhTon} </Text>);
        } else {
            return (<Text style={{color: '#26619c'}}>{status}</Text>);
        }
    }

    _renderWarehouse(warehouse) {
        if (warehouse == '0') {
            return (<Text style={{color: Config.mainColor}}> Không xác định</Text>);
        } else if (warehouse == '1') {
            return (<Text style={{color: Config.mainColor}}> Kho công ty</Text>);
        } else if (warehouse == '2') {
            return (<Text style={{color: Config.mainColor}}> Kho nhà máy</Text>);
        } else if (warehouse == '3') {
            return (<Text style={{color: Config.mainColor}}> Kho khách hàng</Text>);
        } else {
            return (<Text style={{color: Config.mainColor}}>{warehouse}</Text>);
        }
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => Actions.pop()} transparent>
                    <Icon name='ios-arrow-back'/>
                </Button>
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                {/*<Button onPress={() => Actions.search()} transparent>*/}
                {/*<Icon name='ios-search-outline'/>*/}
                {/*</Button>*/}
                {/*<Button onPress={() => Actions.cart()} transparent>*/}
                {/*<Icon name='ios-cart'/>*/}
                {/*</Button>*/}
            </Right>
        );
        return (
            <Container style={{backgroundColor: '#fdfdfd'}}>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.isLoading}
                    //Text with the Spinner
                    //textContent={'Đang đăng nhập ...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                />
                <Navbar left={left} right={right} title={Config.deviceDetail}/>
                <Content contentContainerStyle={{
                    paddingHorizontal: 10,
                    backgroundColor: '#f3f9ff'
                }}>
                    <Card transparent>
                        <CardItem header bordered>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Config.deviceDetail}</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.deviceCode} : </Text>
                            <Input
                                value={this.state.code}
                            />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.deviceStage} : </Text>
                            <Text style={{textAlign: 'left'}}>
                                {this._renderStatus(this.state.stage)}
                            </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.deviceWarehouse} : </Text>
                            <Text style={{textAlign: 'left'}}>
                                {this._renderWarehouse(this.state.warehouse)}
                            </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.deviceCustomer} : </Text>
                            <Input
                                value={this.state.p_customer == null
                                || this.state.p_customer == false
                                || this.state.p_customer.length < 2 ? 'Chưa có' : this.state.p_customer[1]}
                            />
                            </Body>
                        </CardItem>

                        <CardItem>
                            <Left>
                                {/*<Button bordered onPress={() => this.add()}>*/}
                                {/*<Text style={{color: '#fdfdfd'}}> {Config.customerAddTitle} </Text>*/}
                                {/*</Button>*/}
                            </Left>
                            <Body>
                            {/*<Button transparent>*/}
                            {/*<Icon active name="chatbubbles"/>*/}
                            {/*<Text>4 Comments</Text>*/}
                            {/*</Button>*/}
                            </Body>
                            <Right>
                                <Button active onPress={() => Actions.pop()} transparent>
                                    <Text><Icon name='ios-arrow-back'/> {Config.btnClose}</Text>
                                </Button>
                            </Right>
                        </CardItem>

                    </Card>

                </Content>

            </Container>
        );
    }


}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
};

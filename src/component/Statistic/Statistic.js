/**
 * This is the Home page
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {
    Image,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Dimensions,
} from 'react-native';
import {
    Container,
    Content,
    View,
    Button,
    Left,
    Right,
    Icon,
    Card,
    CardItem,
    cardBody,
    Row,
    Grid,
    Col,
    Item,
    Input, List, ListItem,
    // Text
} from 'native-base';
import {Actions} from 'react-native-router-flux';


import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import SideMenu from '../../component/SideMenu';
import SideMenuDrawer from '../../component/SideMenuDrawer';
import Colors from "../../Colors";
import Config from "../../Config";


export default class Statistic extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            customers: [],
            isLoading: true,
            isSearching: false,
            error: null,
            sessionKey: null,

            extractedText: "",
            searchText: '',
            countStage_1: '0',
            countStage_2: '0',
            countStage_3: '0',
            countStage_4: '0',
            countStage_all: '0',

            componentKey: new Date()
        };
    }

    componentDidMount() {
        // this.callApi();
        //this.getSessionKey();
    }

    componentWillMount(): void {
        // this._searchStage(Config.stage1Vo);
        // this._searchStage(Config.stage2TaiNap);
        // this._searchStage(Config.stage3BinhTon);
        // this._searchStage(Config.stage4BinhDangSuDung);
        // // this._searchStageAll();

        this._searchCountStage();

        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var startDate = firstDay.toISOString().split('T')[0];
        var endDate = lastDay.toISOString().split('T')[0];
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setState({componentKey: new Date(), searchText: ''});
    }

    _searchCountStage() {
        console.log('_searchStage_1-----------------search');
        this.setState({isSearching: true});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {

            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));
            var endpoint = '/web/dataset/call_kw';
            var model = 'p.equipment';
            var method = 'read_group';

            var args = [
                []
                // [['stage', '=', status]]
            ];//args

            var params = {
                model: model,
                method: method,
                args: args,
                kwargs: {
                    //domain: [['code', 'like', this.state.searchText]],
                    fields: ['stage', 'sequence'],
                    groupby: ['stage']
                },
            };//params

            global.odooAPI.rpc_call(endpoint, params, this._resSearchStage.bind(this));//odoo.rpc_call

        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _getResConnect(err) {
        if (err) {
            console.log('--------------connect error');
            this.setState({isLoading: false});
            alert(Config.err_connect);
            return console.log(err);
        }
    }
    _resSearchStage(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        if (result != null && result.length > 0) {
            var totalDevice = 0;
            for (var i = 0; i < result.length; i++) {
                // count
                var item = result[i];
                var stageCount = item.stage_count;
                console.log(stageCount);
                var stage = item.stage;
                if (stage == 1) {
                    this.setState({countStage_1: stageCount});
                } else if (stage == 2) {
                    this.setState({countStage_2: stageCount});
                } else if (stage == 3) {
                    this.setState({countStage_3: stageCount});
                } else if (stage == 4) {
                    this.setState({countStage_4: stageCount});
                }
                totalDevice = totalDevice + parseInt(stageCount);
            }
            this.setState({countStage_all: totalDevice});
        }
    }

    _searchCustomer() {
        console.log('_searchCustomer-----------------search');
        this.setState({isSearching: true});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {

            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    alert(Config.err_connect);
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });
            var endpoint = '/web/dataset/call_kw';
            var model = 'p.order';
            var method = 'read_group';

            var args = [
                []
                // [['stage', '=', status]]
            ];//args

            var params = {
                model: model,
                method: method,
                args: args,
                kwargs: {
                    //domain: [['code', 'like', this.state.searchText]],
                    fields: ['stage', 'sequence'],
                    groupby: ['stage']
                },
            };//params

            global.odooAPI.rpc_call(endpoint, params, this._resSearchStage.bind(this));//odoo.rpc_call

        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _resSearchCustomer(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        if (result != null && result.length > 0) {
            var totalDevice = 0;
            for (var i = 0; i < result.length; i++) {
                // count
                var item = result[i];
                var stageCount = item.stage_count;
                console.log(stageCount);
                var stage = item.stage;
                if (stage == 1) {
                    this.setState({countStage_1: stageCount});
                } else if (stage == 2) {
                    this.setState({countStage_2: stageCount});
                } else if (stage == 3) {
                    this.setState({countStage_3: stageCount});
                } else if (stage == 4) {
                    this.setState({countStage_4: stageCount});
                }
                totalDevice = totalDevice + parseInt(stageCount);
            }
            this.setState({countStage_all: totalDevice});
        }
    }





    _searchStage(status) {
        console.log('_searchStage_1-----------------search');
        this.setState({isSearching: true});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {

            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    alert(Config.err_connect);
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });
            var endpoint = '/web/dataset/call_kw';
            var model = 'p.equipment';
            var method = 'search_count';

            var args = [
                [['stage', '=', status]]
            ];//args

            var params = {
                model: model,
                method: method,
                args: args,
                kwargs: {},
            };//params

            // count
            if (status == '1') {
                global.odooAPI.rpc_call(endpoint, params, this._resSearchStage_1.bind(this));//odoo.rpc_call
            } else if (status == '2') {
                global.odooAPI.rpc_call(endpoint, params, this._resSearchStage_2.bind(this));//odoo.rpc_call
            } else if (status == '3') {
                global.odooAPI.rpc_call(endpoint, params, this._resSearchStage_3.bind(this));//odoo.rpc_call
            } else if (status == '4') {
                global.odooAPI.rpc_call(endpoint, params, this._resSearchStage_4.bind(this));//odoo.rpc_call
            } else {
                args = [
                    []
                ];
                global.odooAPI.rpc_call(endpoint, params, this._resSearchStage_All.bind(this));//odoo.rpc_call
            }

        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _resSearchStage_1(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        this.setState({countStage_1: result});
    }

    _resSearchStage_2(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        this.setState({countStage_2: result});
    }

    _resSearchStage_3(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        this.setState({countStage_3: result});
    }

    _resSearchStage_4(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        this.setState({countStage_4: result});
    }

    _searchStageAll() {
        console.log('_searchStage_1-----------------search');
        this.setState({isSearching: true});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {

            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    alert(Config.err_connect);
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });
            var endpoint = '/web/dataset/call_kw';
            var model = 'p.equipment';
            var method = 'search_count';

            var args = [
                []
            ];//args

            var params = {
                model: model,
                method: method,
                args: args,
                kwargs: {},
            };//params

            // count
            global.odooAPI.rpc_call(endpoint, params, this._resSearchStage_All.bind(this));//odoo.rpc_call

        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _resSearchStage_All(err, result) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        this.setState({countStage_all: result});
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => this._sideMenuDrawer.open()} transparent>
                    <Icon name='ios-menu-outline'/>
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
            <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}
                // key={new Date().valueOf()}
                key={this.state.componentKey}
                // fetchData={'1'}
                //             sessionLoginKey={this.props.sessionLoginKey}
            >
                <Container>
                    <Navbar left={left} right={right} title={Config.statisticTitle}/>
                    <Content>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: Config.mainColor
                        }}>
                            <ActivityIndicator
                                animating={this.state.isSearching}
                                color={Config.mainColor}
                                size="large"
                            />

                            <Grid>
                                <Col>
                                    <Card>
                                        <TouchableOpacity onPress={() => {
                                        }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={styles.btnStage1}>{this.state.countStage_1}</Text>
                                                <Text> {Config.statisticCountStage1} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <TouchableOpacity onPress={() => {
                                        }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={styles.btnStage2}>{this.state.countStage_2}</Text>
                                                <Text> {Config.statisticCountStage2} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </Col>
                            </Grid>

                            <Grid>
                                <Col>
                                    <Card>
                                        <TouchableOpacity onPress={() => {
                                        }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={styles.btnStage3}>{this.state.countStage_3}</Text>
                                                <Text> {Config.statisticCountStage3} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <TouchableOpacity onPress={() => {
                                        }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={styles.btnStage4}>{this.state.countStage_4}</Text>
                                                <Text> {Config.statisticCountStage4} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </Col>
                            </Grid>

                            <Grid>
                                <Col>
                                    <Card>
                                        <TouchableOpacity onPress={() => {
                                        }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={styles.btnStageAll}>{this.state.countStage_all}</Text>
                                                <Text> {Config.statisticCountAll} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </Col>
                            </Grid>
                        </View>

                    </Content>
                </Container>
            </SideMenuDrawer>);

    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    scrollContainer: {
        // height: 150,
        marginTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 20
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },
    capturePhoto: {
        width: 120,
        height: 120,
        borderRadius: 10,
        // marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },

    line: {
        width: '47%',
        height: 3,
        backgroundColor: '#7f8c8d',
        position: 'absolute',
        bottom: '0%',
        marginLeft: 5
    },
    titleView: {
        flex: 1, width: '97%',
        backgroundColor: Config.mainColor,
        borderRadius: 5,
        borderWidth: 0.5,
        margin: 5,
    },
    title: {
        fontSize: 16, fontFamily: 'Roboto',
        fontWeight: '200',
        color: 'white',
        margin: 10,
    },
    icon: {
        fontSize: 13
    },
    stage0: {
        color: '#ffa505'
    },
    stage1: {
        color: Config.colorThin
    },
    stage2: {
        color: '#ff00ff'
    },
    stage3: {
        color: '#c40521'
    },
    stage4: {
        color: '#44bc37'
    },
    btnStage1: {
        color: Config.colorThin,
        fontSize: 40
    },
    btnStage2: {
        color: '#ff00ff',
        fontSize: 40
    },
    btnStage3: {
        color: '#c40521',
        fontSize: 40
    },
    btnStage4: {
        color: '#44bc37',
        fontSize: 40
    },
    btnStageAll: {
        color: Config.mainColor,
        fontSize: 40
    },
});

const _styles = {
    font: {
        fontFamily: 'Roboto',
        color: Colors.navbarBackgroundColor
    },
    icon: {
        fontSize: 13
    },
    stage0: {
        color: '#ffa505'
    },
    stage1: {
        color: Config.colorThin
    },
    stage2: {
        color: '#ff00ff'
    },
    stage3: {
        color: '#c40521'
    },
    stage4: {
        color: '#44bc37'
    },

};


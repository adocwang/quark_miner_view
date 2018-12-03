import React, {Component} from 'react';
import {Form, Input, Button, Layout, Table, Tag} from 'element-react';
import * as Http from './httpUtils';

import 'element-theme-default';

const PEER_URL = "http://54.70.162.141:38391";
const ACCOUNT_BASE = "0x02772C614F2c339e87527e75E63859bb6AdEaA36022C7EA";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountBase: ACCOUNT_BASE,
            shardId: 3,
            trxHeight: 5000,
            blockColumns: [
                {
                    label: "id",
                    prop: "id"
                },
                {
                    label: "shard",
                    prop: "shard",
                    width: 80,
                    render: function (data) {
                        return <Tag>{parseInt(data.shard, 16)}</Tag>
                    }
                },
                {
                    label: "height",
                    prop: "height",
                    width: 100,
                    render: function (data) {
                        return <Tag>{parseInt(data.height, 16)}</Tag>
                    }
                },
                {
                    label: "difficulty",
                    prop: "difficulty",
                    width: 100,
                    render: function (data) {
                        return <Tag>{parseInt(data.shard, 16)}</Tag>
                    }
                },
                {
                    label: "miner",
                    prop: "miner",
                    render: function (data) {
                        return <Tag type={data.miner.indexOf(ACCOUNT_BASE.toLocaleLowerCase())>-1?"success":"gray"}>{data.miner}</Tag>
                    }
                },
            ],
            blocks: [],
            myInfoColumns: [
                {
                    label: "shard",
                    prop: "shard",
                    width: 80,
                    render: function (data) {
                        return <Tag>{parseInt(data.shard, 16)}</Tag>
                    }
                },
                {
                    label: "balance",
                    prop: "balance",
                    render: function (data) {
                        return <Tag>{parseInt(data.balance, 16) / 1000000000000000000}</Tag>
                    }
                },
                {
                    label: "transactionCount",
                    prop: "transactionCount",
                    render: function (data) {
                        return <Tag>{parseInt(data.transactionCount, 16)}</Tag>
                    }
                }
            ],
            myInfo: [],
            shardSize: 0,
            networkId: 0
        };
        this.getNetworkInfo();
        this.getMyAccount = this.getMyAccount.bind(this);
    }

    getNetworkInfo() {

        Http.postRequest(PEER_URL, {"jsonrpc": "2.0", "method": "networkInfo", "id": 1}).then(data => {
            console.log(data);
            if (!data.result) {
                alert('error');
                return;
            }
            this.setState({
                networkId: parseInt(data.result.networkId, 16),
                shardSize: parseInt(data.result.shardSize, 16)
            });
            this.getMyAccount();
        });
    }

    getMyAccount() {
        for (let i = 0; i < this.state.shardSize; i++) {
            Http.postRequest(PEER_URL, {
                "jsonrpc": "2.0",
                "method": "getAccountData",
                "params": [this.state.accountBase + i],
                "id": 1
            }).then(data => {
                if (!data.result) {
                    return;
                }
                let myInfo = this.state.myInfo;
                myInfo[parseInt(data.result.primary.shard, 16)] = data.result.primary;
                this.setState({
                    myInfo: myInfo
                });
                console.log(myInfo);
            });
        }
    }

    queryBlockByHeight() {
        let data={
            jsonrpc: "2.0",
            params: ["0x" + this.state.shardId.toString(16), "0x" + this.state.trxHeight.toString(16), false],
            method: "getMinorBlockByHeight",
            id: 1
        };
        console.log(data);
        console.log(this.state);
        Http.postRequest(PEER_URL, data).then(data => {
            console.log(data);
            if (!data.result) {
                alert('no height' + this.state.trxHeight + ' in shard' + this.state.shardId);
                return;
            }
            let blocks = this.state.blocks;
            blocks.push(data.result);
            this.setState({blocks: blocks});
        });
    }

    render() {
        return (
            <div>
                <div>
                    <Layout.Row>
                        <Layout.Col span="24">
                            <div>账号信息</div>
                        </Layout.Col>
                    </Layout.Row>
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.myInfoColumns}
                        data={this.state.myInfo}
                        border={true}
                    />
                    <Button onClick={this.getMyAccount.bind(this)}>刷新</Button>
                </div>
                <Form ref="form" labelWidth="100" className="demo-dynamic">
                    <Form.Item label={`设置分片`}>
                        <Layout.Col span="11">
                            <Input value={this.state.shardId} onChange={(data) => {
                                this.setState({shardId: parseInt(data)})
                            }}/>
                        </Layout.Col>
                    </Form.Item>
                </Form>
                <Form ref="form" labelWidth="100" className="demo-dynamic">
                    <Form.Item label={`区块查询`}>
                        <Layout.Col span="11">
                            <Input value={this.state.trxHeight} onChange={(data) => {
                                this.setState({trxHeight: parseInt(data)})
                            }}/>
                        </Layout.Col>
                        <Layout.Col span="11">
                            <Button onClick={this.queryBlockByHeight.bind(this)}>查询</Button>
                        </Layout.Col>
                    </Form.Item>
                </Form>
                <div>
                    <Layout.Row>
                        <Layout.Col span="24">
                            <div>区块结果</div>
                        </Layout.Col>
                    </Layout.Row>
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.blockColumns}
                        data={this.state.blocks}
                        border={true}
                        height={250}
                    />
                </div>
            </div>
        );
    }
}

export default App;

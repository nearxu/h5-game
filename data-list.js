import React, { Component } from 'react';
import PropTypes from 'prop-types';
import http from '@/utils/request';
import Pagination from '../pagination';
import styles from './data-list.scss';
import LoadingIndicator from 'react-loading-indicator';
import { isEqual } from 'lodash';

const RequestStatusEnum = {
    IDLE: 0,
    PENDING: 1,
    SUCCESS: 2,
    FAIL: 3
};

const RequestMethodEnum = {
    GET: 'get',
    POST: 'post'
};

const defaultRequestData = {};

function formatRequestUrl(url, pageIndex, pageSize, requestMethod) {
    if (requestMethod === RequestMethodEnum.GET) {
        return `${url}${
            url.indexOf('?') > -1 ? '&' : '?'
            }pageIndex=${pageIndex}&pageSize=${pageSize}`;
    }
    return url;
}

function formatResponseData(res) {
    return res.data;
}

function formatRequestData(data = defaultRequestData, pageIndex, pageSize) {
    return {
        ...data,
        pageIndex,
        pageSize
    };
}

export default class DataListProvider extends Component {
    constructor(props) {
        super(props);
        let pageIndex = props.pageIndex;
        if (typeof pageIndex !== 'number') {
            pageIndex = props.startIndex;
        }
        this.state = {
            pageIndex,
            data: [],
            requestStatus: RequestStatusEnum.IDLE,
            hasNext: false
        };
        this.pageSize = props.pageSize;
    }

    static propTypes = {
        url: PropTypes.string.isRequired, // 数据请求 url
        pageSize: PropTypes.number,
        pageIndex: PropTypes.number,
        formatRequestUrl: PropTypes.func, // 格式化请求 url 方式
        formatResponseData: PropTypes.func, // 格式化请求返回数据方法
        requestMethod: PropTypes.oneOf(['get', 'post']), // 请求方式
        requestData: PropTypes.object, // 请求数据
        formatRequestData: PropTypes.func, // 格式化请求数据方法
        onPageChange: PropTypes.func, // 页数更改是的回调方法
        requestConfig: PropTypes.object, // 请求设置
        onRequestSuccess: PropTypes.func, // 请求成功的回调方法
        render: PropTypes.func.isRequired,
        onPageRequestIdle: PropTypes.func, // 页面首页加载成功的回调
        hasNext: PropTypes.bool,
        placeholder: PropTypes.node,
        placeholderText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        startIndex: PropTypes.number
    };

    static defaultProps = {
        formatRequestUrl,
        formatResponseData,
        formatRequestData,
        pageSize: 10,
        pageIndex: 0,
        requestMethod: 'get',
        requestConfig: {},
        startIndex: 0
    };

    componentDidMount() {
        // 数据初次加载时，如果并不是从第一页开始加载，则需要加载此前之前的所有数据
        this.initialize();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.requestData, this.props.requestData)) {
            if (nextProps.pageIndex && nextProps.pageIndex !== this.props.pageIndex) {
                this.initialize(nextProps.pageIndex);
                this.setState({ pageIndex: nextProps.pageIndex });
            } else {
                this.resetState(this.fetch.bind(this));
            }
        }
    }

    initialize(pageIndex = this.props.pageIndex) {
        let pageSize = 0;
        if (pageIndex) {
            pageSize = (pageIndex + 1 - this.props.startIndex) * this.props.pageSize;
        } else {
            pageSize = this.props.pageSize;
        }
        this.fetch(this.props.startIndex, pageSize).then(() => {
            this.props.onPageRequestIdle && this.props.onPageRequestIdle();
        });
    }

    resetState(fn) {
        this.setState(
            {
                data: [],
                pageIndex: this.props.pageIndex,
                hasNext: false
            },
            fn
        );
    }

    responseHandle(res, resolve, pageSize = this.props.pageSize) {
        const { onRequestSuccess, formatResponseData } = this.props;
        onRequestSuccess && onRequestSuccess(res);
        const data = formatResponseData(res);
        const prevData = this.state.data;
        this.setState(
            {
                data: prevData.concat(data),
                requestStatus: RequestStatusEnum.SUCCESS
            },
            () => resolve()
        );
        if (data.length < pageSize) {
            this.setState({ hasNext: false });
        } else {
            if (!this.state.hasNext) {
                this.setState({ hasNext: true });
            }
        }
    }

    pageChangeHandle(pageIndex) {
        if (this.state.pageIndex === pageIndex) {
            return undefined;
        }
        this.setState({ pageIndex: pageIndex });
        this.fetch(pageIndex);
        this.props.onPageChange && this.props.onPageChange(pageIndex);
    }

    fetch(pageIndex = this.state.pageIndex, pageSize = this.props.pageSize) {
        return new Promise((resolve, reject) => {
            const {
                url,
                formatRequestUrl,
                requestMethod,
                formatRequestData,
                requestData,
                requestConfig
            } = this.props;
            const requestUrl = formatRequestUrl(url, pageIndex, pageSize);
            this.setState({ requestStatus: RequestStatusEnum.PENDING });
            if (requestMethod === RequestMethodEnum.GET) {
                http
                    .get(requestUrl, { ...requestConfig })
                    .then(res => this.responseHandle(res, resolve, pageSize));
            } else {
                const data = formatRequestData(requestData, pageIndex, pageSize);
                http
                    .post(requestUrl, data, { ...requestConfig })
                    .then(res => this.responseHandle(res, resolve, pageSize));
            }
        });
    }

    render() {
        const { requestStatus, data } = this.state;
        if (!data.length) {
            if (requestStatus === RequestStatusEnum.SUCCESS) {
                return <EmptyDataList />;
            }
            // if (requestStatus === RequestStatusEnum.PENDING) {
            //   return <LoadingScreen />;
            // }
        }
        return (
            <div>
                {this.props.render({ ...this.state })}
                {(typeof this.props.hasNext === 'boolean' || this.state.hasNext) && (
                    <Pagination
                        hasNext={
                            typeof this.props.hasNext === 'boolean'
                                ? this.props.hasNext
                                : this.state.hasNext
                        }
                        onChange={this.pageChangeHandle.bind(this)}
                        pageIndex={this.state.pageIndex}
                        render={() => (
                            <NextPageButton
                                isPending={requestStatus === RequestStatusEnum.PENDING}
                            />
                        )}
                    />
                )}
            </div>
        );
    }
}

function EmptyDataList() {
    return (
        <div className="empty">
            <div className="empty-image" />
            <div className="empty-text">对不起，暂无相关数据</div>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className={styles.loading}>
            <LoadingIndicator />
        </div>
    );
}

function NextPageButton({ isPending }) {
    return (
        <div className={styles['navigation-button-block']}>
            {!isPending ? (
                <button className={styles['navigation-button']}>加载更多</button>
            ) : (
                    // <LoadingIndicator />
                    ''
                )}
        </div>
    );
}

import { Alert } from 'react-native';
export default class Service {
    urlString = 'http://testservice.esukh.mn/servicecalendar.asmx';
 
    query() {
        var url;
        if (arguments.length > 0) {
            var combine = (arr, to) => {
                var result = '';
                for (var i = 0; i < to; i++) {
                    result += '/' + arr[i];
                }
                return result;
            };
            if (typeof arguments[arguments.length - 1] === 'object') {
                url = new URL(this.urlString + combine(arguments, arguments.length - 1));
                var params = arguments[arguments.length - 1];
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            } else {
                url = new URL(this.urlString + combine(arguments, arguments.length));
            }
        } else {
            url = new URL(this.urlString);
        }
        return fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }
    get() {
        var url = this.urlString;
        for (var i in arguments) {
            url += '/' + arguments[i];
        }
        return fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }
    post() {
        var url = this.urlString;
        for (var i = 0; i < arguments.length - 1; i++) {
            url += '/' + arguments[i];
        }
        var params = arguments[arguments.length - 1];
        var data = Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join('&');
        return fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            },
            body: data
        });
    }
    put() {
        var url = this.urlString;
        for (var i = 0; i < arguments.length - 1; i++) {
            url += '/' + arguments[i];
        }
        return fetch(url, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[arguments.length - 1])
        });
    }
    delete() {
        var url = this.urlString;
        for (var i in arguments) {
            url += '/' + arguments[i];
        }
        return fetch(url, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }
    handleError = err => {
        Alert.alert('Алдаа гарлаа','Уучлаарай, сервертэй харьцах явцад алдаа гарлаа.');
        console.log(err);
    }
    
}
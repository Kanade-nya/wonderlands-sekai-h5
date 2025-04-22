interface User<T> {
    id: number,
    name: string,
    data: T
}

interface DataLog {
    time: string,
    action: string
}


const resData = (): User<object> => {
    let name = 'zhang',
        id = 1,
        data: DataLog = {
            time: '2020-01-01',
            action: 'login'
        };
    return {
        id,
        name,
        data
    }
}


console.log(resData())


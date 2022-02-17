function AmongUS() {
    const todo = {
        title: 'PostRequest'
    };

    let response = fetch('/join', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        mode: 'cors'
    })
        .then(i => i.text())
        .then(async id => {
            // async function takeTask(id) {
            let getStatus;
            let getTask;
            await fetch(`/crew/${id}/tasks/next`)
                .then(response => {
                    getStatus = response.status
                    return response.text()
                }).then(async data => {
                    getTask = data
                    // console.log(getTask)
                    let ind = 1
                    while (getStatus !== 204) {
                        console.log(getTask)
                        if (getStatus === 200) {
                            console.log("ok")
                            await fetch(`/crew/${id}/tasks/${getTask}`)
                                .then(r2 => r2.json())
                                .then(async object => {
                                    console.log(object)
                                    let routingInfo;
                                    if (getTask === "cleaning1") {
                                        const result1 = []
                                        object.forEach((value, index) => {
                                            if (!result1.includes(value)) {
                                                result1.push(value)
                                            }
                                        })
                                        console.log(result1)
                                        await fetch(`/crew/${id}/tasks/cleaning1`, {
                                            method: 'POST',
                                            body: JSON.stringify(result1),
                                            headers: {
                                                'Content-type': 'application/json; charset=UTF-8'
                                            },
                                            mode: 'cors'
                                        })
                                            .then(task1 => task1.status)
                                            .then(res1 => getStatus = res1)
                                    } else if (getTask === "cleaning2") {
                                        let result2
                                        const numbers = []
                                        const nonnumbers = []
                                        object.forEach((value, index) => {
                                            if (parseFloat(value)) {
                                                numbers.push(value)
                                            } else {
                                                nonnumbers.push(value)
                                            }
                                        })
                                        result2 = {"numbers": numbers, "non-numbers": nonnumbers}
                                        console.log(typeof result2)
                                        await fetch(`/crew/${id}/tasks/cleaning2`, {
                                            method: 'POST',
                                            body: JSON.stringify(result2),
                                            headers: {
                                                'Content-type': 'application/json; charset=UTF-8'
                                            },
                                            mode: 'cors'
                                        })
                                            .then(task2 => task2.status)
                                            .then(res2 => getStatus = res2)
                                    } else if (getTask === "decoding") {
                                        const mess = object.message
                                        const code = object.key
                                        let result3 = ""
                                        mess.forEach((value) => {
                                            result3 = result3 + code[value.toString()]
                                        })
                                        console.log(result3)
                                        await fetch(`/crew/${id}/tasks/decoding`, {
                                            method: 'POST',
                                            body: result3,
                                            headers: {
                                                'Content-type': 'application/json; charset=UTF-8'
                                            },
                                            mode: 'cors'
                                        })
                                            .then(task3 => task3.status)
                                            .then(res3 => console.log(res3))
                                    } else if (getTask === "lookup") {
                                        const list = object[Object.keys(object)[0]]
                                        const word = list.split(".")
                                        let data = object[Object.keys(object)[1]]
                                        let temp4
                                        word.forEach((val) => {
                                            if (typeof data[val] === "object") {
                                                data = data[val]
                                            } else {
                                                temp4 = data[val]
                                                console.log(temp4)
                                            }
                                        })
                                        await fetch(`/crew/${id}/tasks/lookup`, {
                                            method: 'POST',
                                            body: temp4,
                                            headers: {
                                                'Content-type': 'application/json; charset=UTF-8'
                                            },
                                            mode: 'cors'
                                        })
                                            .then(task4 => task4.status)
                                            .then(res4 => console.log(res4))
                                    } else if (getTask === "dispatch") {
                                        for (const prop in object) {
                                            await fetch(`/crew/${id}/tasks/dispatch/${prop}`, {
                                                method: 'PUT',
                                                body: JSON.stringify(object[prop]),
                                                headers: {
                                                    'Content-type': 'application/json; charset=UTF-8'
                                                },
                                                mode: 'cors'
                                            })
                                                .then(task5 => task5.status)
                                                .then(res5 => console.log(res5))
                                        }
                                    } else {
                                        let routingStatus
                                        let routingData
                                        let path = object[Object.keys(object)[0]];
                                        let value = object[Object.keys(object)[1]];
                                        await fetch(`/crew/${id}/tasks/routing/${path}`, {
                                            method: 'PUT',
                                            body: JSON.stringify(value),
                                            headers: {
                                                'Content-type': 'application/json; charset=UTF-8'
                                            },
                                            mode: 'cors'
                                        })
                                            .then(task6 => {
                                                routingStatus = task6.status
                                                return task6.text()
                                            })
                                            .then(res61 => {
                                                routingData = res61
                                                console.log(routingData)
                                            })
                                        while (routingStatus === 202) {
                                            let routingInfo = JSON.parse(routingData)
                                            path = routingInfo[Object.keys(routingInfo)[0]];
                                            value = routingInfo[Object.keys(routingInfo)[1]];
                                            await fetch(`/crew/${id}/tasks/routing/${path}`, {
                                                method: 'PUT',
                                                body: JSON.stringify(value),
                                                headers: {
                                                    'Content-type': 'application/json; charset=UTF-8'
                                                },
                                                mode: 'cors'
                                            })
                                                .then(task62 => {
                                                    routingStatus = task62.status
                                                    return task62.text()
                                                })
                                                .then(res611 => {
                                                    routingData = res611
                                                    console.log(routingData)
                                                })
                                        }
                                        getStatus = 200
                                    }
                                })
                        } else {
                            let resultRepair = []
                            await fetch(`/crew/${id}/tasks/repair`)
                                .then(r2 => r2.json())
                                .then(object => {
                                    for (let obj in object) {
                                        if (object[obj] !== 0) {
                                            if (object[obj] < 0) {
                                                object[obj] = object[obj] * -1
                                            }
                                            object[obj] = 1 / object[obj]
                                            object[obj] = object[obj] * object[obj] * object[obj]
                                            object[obj] = object[obj] % 360
                                            resultRepair.push(object[obj])
                                        } else {
                                            resultRepair.push(0)
                                        }
                                    }
                                })
                            console.log(resultRepair)
                            await fetch(`/crew/${id}/tasks/repair`, {
                                method: 'POST',
                                body: JSON.stringify(resultRepair),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8'
                                },
                                mode: 'cors'
                            })
                                .then(task7 => task7.status)
                                .then(res7 => getStatus = res7)
                        }
                        console.log(getStatus)
                        await fetch(`/crew/${id}/tasks/next`)
                            .then(response => {
                                getStatus = response.status
                                return response.text()
                            }).then(async data => {
                                getTask = data
                            })
                    }
                })
        })
}
AmongUS()

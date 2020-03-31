import Swal from 'sweetalert2'

export const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    // timer: time,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const showAjaxToast = (loadingMessage, successMessage, errorMessage, waitingTime = 1000, url, method, data, onFinished = false, onError = false) => {
    Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        onOpen: (toast) => {
            Swal.showLoading();
            fetch(url, {
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                // This timeout makes the ui render looks better when the response come back quickly
                setTimeout(() => {
                    if (response.status === 200) {
                        Toast.fire({
                            icon: 'success',
                            title: successMessage,
                            timer: waitingTime
                        }).then((result) => {
                            onFinished && onFinished()
                        })
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: errorMessage,
                            timer: waitingTime,
                        })
                        onError && onError()
                    }
                }, 1000)
            }).catch(err => {
                Toast.fire({
                    icon: 'error',
                    title: errorMessage,
                    timer: waitingTime,
                })
                onError && onError()
            })
        }
    }).fire({
        icon: 'loading',
        title: loadingMessage
    })
}
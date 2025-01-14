/* eslint-disable */
import Api from '@/services/Api'

export default {
  index(search) {
    return Api().get('products', {
      params: {
        search: search
      }
    })
  },
  show(productId) {
    return Api().get(`products/${productId}`)
  },
  post(product) {
    return Api().post('products', product)
  },
  put(product) {
    return Api().put(`products/${product.id}`, product)
  }
}

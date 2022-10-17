import { action, makeObservable, observable } from "mobx"
import Base from './base'
import ObjectMapper from '../utils/object.mapper'

class BGPStore extends Base {
    module = "bgp"

    conf = {}

    constructor(module) {
        super(module)
        makeObservable(this, {
            conf: observable,
            getConf: action,
            createConf: action,
            patchConf: action,
        })
    }

    get confMapper() {
        return ObjectMapper["BGPCONF"] || (conf => conf)
    }

    get getConfUrl() {
        return `${this.apiVersion}/${this.module}/conf`
    }

    async getConf() {
        this.isLoading = true

        const result = await request.get(this.getConfUrl)
        const conf = { ...this.confMapper(result), Kind: 'BgpConf' }
        
        this.conf = conf
        this.isLoading = false
        return conf
    }

    createConf(data, params = {}) {
        return this.submitting(request.post(this.getConfUrl, data))
    }

    async patchConf(newObject) {
        return this.submitting(request.patch(this.getConfUrl, newObject))
    }
}

export default BGPStore
import React, { useState } from 'react'
import { Select, Input } from '@kube-design/components'
import classnames from 'classnames'
import styles from './index.module.scss'

const IPV4 = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/

const IP_PREFIX = /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))\/([1-2][0-9]|3[0-2]|[1-9])$/

const LAST_IP = /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))-(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))$/

export const IPCONFIG = [
  {
    label: 'IP',
    value: 'IP',
    validator: (value, callback) => {
      if (value.indexOf('/') !== -1 || value.indexOf('-') !== -1 || value.length > 15) {
        return callback({ message: 'Please enter the correct ip address.' })
      }

      if (!IPV4.test(value)) {
        return callback({ message: 'Please enter the correct ip address.' })
      }

      callback()
    }
  },
  {
    label: 'IP/Subnet mask',
    value: 'IP/Subnet mask',
    validator: (value, callback) => {
      if (value.indexOf('-') !== -1) {
        return callback({ message: 'Please enter the correct IP/Subnet mask.' })
      }

      if (!IP_PREFIX.test(value)) {
        return callback({ message: 'Please enter the correct IP/Subnet mask.' })
      }

      callback()
    }
  },
  {
    label: 'IP segment',
    value: 'IP segment',
    validator: (value, callback) => {
      if (value.indexOf('-') !== -1) {
        return callback({ message: 'Please enter the correct IP segment' })
      }

      if (!LAST_IP.test(value)) {
        return callback({ message: 'Please enter the correct IP segment' })
      }

      callback()
    }
  },
]

const getStateFormProps = (value) => {
  let _ipType = 'IP'
  let _ipAddress = value
  let _ipMask = ''
  let _endAddress = ''

  if (value.indexOf('/') !== -1) {
    _ipType = 'IP/Subnet mask'
    _ipAddress = value.split('/')[0]
    _ipMask = value.split('/')[1]
  } else if (value.indexOf('-') !== -1) {
    _ipType = 'IP segment'
    _ipAddress = value.split('/')[0]
    _endAddress = value.split('/')[1]
  }

  return {
    _ipType,
    _ipAddress,
    _ipMask,
    _endAddress
  }
}

const IPSelect = (props) => {
  const { value, onChange } = props
  const { _ipType, _ipAddress, _ipMask, _endAddress } = getStateFormProps(value)

  const [IpType, setIpType] = useState(_ipType)
  const [ipAddress, setIpAddress] = useState(_ipAddress)
  const [ipMask, setIpMask] = useState(_ipMask)
  const [endIpAddress, setEndIpAddress] = useState(_endAddress)

  const handleIpTypeChange = (type) => {
    setIpType(type)
    setIpAddress('')
    setIpMask('')
    setEndIpAddress('')
    onChange('')
  }

  const ipValidate = (value) => {
    const { onError } = props

    if (!value) {
      onError()
    }

    const validator = IPCONFIG.filter(item => item.value === IpType)[0].validator
    validator(value, onError)
  }

  const ipAddressChange = (e, value) => {
    setIpAddress(value)
    ipValidate(value)
    onChange(`${value}`)
  }

  const ipMaskChange = (e, mask) => {
    const _address = `${ipAddress}/${mask}`
    
    setIpMask(mask)
    onChange(_address)
    ipValidate(_address)
  }

  const endAddressChange = (e, endAddress) => {
    const _address = `${ipAddress}-${endAddress}`

    setEndIpAddress(endAddress)
    onChange(_address)
    ipValidate(_address)
  }

  const renderIpAddress = (className) => <Input className={classnames(styles.ipInput, className)} value={ipAddress} onChange={ipAddressChange} />

  const IpInput = {
    IP: renderIpAddress(),
    "IP/Subnet mask": (
      <>
        {renderIpAddress(styles.input)}
        <span>/</span>
        <Input className={styles.input} value={ipMask} onChange={ipMaskChange} />
      </>
    ),
    "IP segment": (
      <>
        {renderIpAddress(styles.input)}
        <span>-</span>
        <Input className={styles.input} value={endIpAddress} onChange={endAddressChange} />
      </>
    )
  }

  return (
    <div className={styles.IpSelect}>
      <Select
        options={IPCONFIG.map(({ label, value }) => ({
          label,
          value
        }))}
        value={IpType}
        onChange={handleIpTypeChange}
        placeholder=" "
      />
      {IpInput[IpType]}
    </div>
  )
}

export default IPSelect
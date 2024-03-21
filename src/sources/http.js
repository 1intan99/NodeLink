import { debugLog, makeRequest, encodeTrack } from '../utils.js'

async function loadFrom(uri) {
  return new Promise(async (resolve) => {
    const type = uri.startsWith('http://') ? 'http' : 'https'
    debugLog('loadtracks', 4, { type: 1, loadType: 'track', sourceName: type, query: uri })

    const data = await makeRequest(uri, { method: 'HEAD' })
    
    
    if (data.error) {
      debugLog('loadtracks', 4, { type: 3, loadType: 'track', sourceName: type, query: uri, message: 'Not possible to connect to the URL.', })

      return resolve({
        message: 'Not possible to connect to the URL.',
        severity: 'fault',
        cause: 'Unknown'
      })
    }


    if (!data.headers || !data.headers['content-type']?.startsWith('audio/')) {
      debugLog('loadtracks', 4, { type: 2, loadType: 'error', sourceName: type, query: uri, message: 'Url is not a playable stream.' })

      return {
        loadType: 'error',
        data: {
          message: 'Url is not a playable stream.',
          severity: 'common',
          cause: 'Invalid URL'
        }
      }
    }

    const track = {
      identifier: 'unknown',
      isSeekable: false,
      author: 'unknown',
      length: -1,
      isStream: false,
      position: 0,
      title: 'unknown',
      uri,
      artworkUrl: null,
      isrc: null,
      sourceName: type
    }

    debugLog('loadtracks', 4, { type: 2, loadType: 'track', sourceName: type, track, query: uri })

    return {
      loadType: 'track',
      data: {
        encoded: encodeTrack(track),
        info: track,
        pluginInfo: {}
      }
    }
  })
}

export default {
  loadFrom
}
onmessage = (e) => {
  console.log('worker received message ---', e)
};
setInterval(()=> {
    postMessage('hahahah')
},1000)


// Convolution layers
var check_function= new Object();
// N,C,L
// console.log(conv1d([1,1,277],3,64,3,1,2,1))
check_function.Conv1d = function(inS=[1,1,1],inC=3,outC=1,K=1,P=0,D=1,S=1){
  if(inS[1]!==inC){
    console.warn("input shape don't match the inchannel")
  }
  // const W = (inShape[2] - K + 2 * P)/S + 1
  const L = (inS[2] + 2*P - D*(K-1) -1)/S +1
  return [inS[0],outC,L]
}


// N,C,H,W 
// console.log(conv2d([1,1,277,277],inC=3,outC=3,K=[3,3],P=[1,1],D=[1,1],S=[1,1]))
check_function.Conv2d = function(inS,InC,outC,K,P,D,S){
  const H = (inS[2] + 2*P[0] - D[0]*(K[0]-1)-1)/S[0] +1
  const W = (inS[3] + 2*P[1] - D[1]*(K[1]-1)-1)/S[1] +1
  return [inS[0],outC,H,W]
}


// N,C,D,H,W 
// console.log(conv3d([1,1,3,277,277],inC=3,outC=3,K=[3,3,3],P=[1,1,1],D=[1,1,1],S=[1,1,1]))
check_function.Conv3d = function(inS,InC,outC,K,P,D,S){
  const D_ = (inS[2] + 2*P[0] - D[0]*(K[0]-1)-1)/S[0] +1
  const H = (inS[3] + 2*P[1] - D[1]*(K[1]-1)-1)/S[1] +1
  const W = (inS[4] + 2*P[2] - D[2]*(K[2]-1)-1)/S[2] +1
  return [inS[0],outC,D_,W,H]
}

// console.log(ConvTranspose1d([1,1,277],3,64,4,1,2,1))
check_function.ConvTranspose1d  = function(inS,InC,outC,K,P,S,OP){
  const L = (inS[2]-1)*S-2*P+K+OP
  return [inS[0],outC,L]
}

// console.log(ConvTranspose1d([1,1,277],3,64,4,1,2,1))
check_function.ConvTranspose2d = function(inS,InC,outC,K,P,S,OP){
  const H = (inS[2]-1)*S[0]-2*P[0]+K[0]+OP[0]
  const W = (inS[2]-1)*S[1]-2*P[1]+K[1]+OP[1]
  return [inS[0],outC,H,W]
}

check_function.ConvTranspose3d = function(inS,InC,outC,K,P,S,OP){
  const D = (inS[2]-1)*S[0]-2*P[0]+K[0]+OP[0]
  const H = (inS[2]-1)*S[1]-2*P[1]+K[1]+OP[1]
  const W = (inS[2]-1)*S[2]-2*P[2]+K[2]+OP[2]
  return [inS[0],outC,D,H,W]
}

check_function.Unfold = function(inS,InC,outC,D,P,S){

}

check_function.Fold = function(inS,InC,outC,D,P,S){

}
// Pooling layers
check_function.MaxPool1d = function(inS,inC,K,P,D,S){
  const L = (inS[2] + 2*P - D*(K-1) -1)/S +1
  return [inS[0],inS[1],L]
}

check_function.MaxPool2d = function(inS,InC,K,P,D,S){
  const H = (inS[2] + 2*P[0] - D[0]*(K[0]-1)-1)/S[0] +1
  const W = (inS[3] + 2*P[1] - D[1]*(K[1]-1)-1)/S[1] +1
  return [inS[0],inS[1],H,W]
}

check_function.MaxPool3d = function(inS,InC,K,P,D,S){
  const D_ = (inS[2] + 2*P[0] - D[0]*(K[0]-1)-1)/S[0] +1
  const H = (inS[3] + 2*P[1] - D[1]*(K[1]-1)-1)/S[1] +1
  const W = (inS[4] + 2*P[2] - D[2]*(K[2]-1)-1)/S[2] +1
  return [inS[0],inS[1],D_,W,H]
}
check_function.MaxUnpool1d = function(inS,inC,K,P,S){
  const L = (inS[2]-1)*S-2*P+K
  return [inS[0],inS[1],L]
}
check_function.MaxUnpool2d = function(inS,inC,K,P,S){
  const H = (inS[2]-1)*S[0]-2*P[0]+K[0]
  const W = (inS[2]-1)*S[1]-2*P[1]+K[1]
  return [inS[0],inS[1],H,W]
}
check_function.MaxUnpool3d = function(inS,inC,K,P,S){
  const D = (inS[2]-1)*S[0]-2*P[0]+K[0]
  const H = (inS[2]-1)*S[1]-2*P[1]+K[1]
  const W = (inS[2]-1)*S[2]-2*P[2]+K[2]
  return [inS[0],inS[1],D,H,W]

}

check_function.AvgPool1d = function(inS,inC,K,P,S){
  const L = (inS[2] + 2*P - K)/S +1
  return [inS[0],inS[1],L]
}

check_function.AvgPool2d = function(inS,InC,K,P,S){
  const H = (inS[2] + 2*P[0] - K[0])/S[0] +1
  const W = (inS[3] + 2*P[1] - K[1])/S[1] +1
  return [inS[0],inS[1],H,W]
}

check_function.AvgPool3d = function(inS,InC,K,P,S){
  const D_ = (inS[2] + 2*P[0] - K[0])/S[0] +1
  const H = (inS[3] + 2*P[1] - K[1])/S[1] +1
  const W = (inS[4] + 2*P[2] - K[2])/S[2] +1
  return [inS[0],inS[1],D_,W,H]

}

check_function.FractionalMaxPool2d = function(inS,output_size,output_ratio){
  if(output_size)return [inS[0],inS[1],output_size[0],output_size[0]]
  if(output_ratio)return [inS[0],inS[1],inS[2]/output_ratio[0],inS[3]/output_size[1]]
}
check_function.LPPool1d = function(inS,InC,K,S){
  const L = (inS[2] - K)/S +1
  return [inS[0],inS[1],L]

}
check_function.LPPool2d = function(inS,InC,K,S){
  const H = (inS[2] - K[0])/S[0] +1
  const W = (inS[3] - K[1])/S[1] +1
  return [inS[0],inS[1],H,W]

}
check_function.AdaptiveMaxPool1d = function(inS,InC,output_size){
  return [inS[0],inS[1],output_size]
}
check_function.AdaptiveMaxPool2d = function(inS,InC,output_size){
  return [inS[0],inS[1],output_size[0],output_size[1]]
}
check_function.AdaptiveMaxPool3d = function(inS,InC,output_size){
  return [inS[0],inS[1],output_size[0],output_size[1],output_size[2]]
}

check_function.AdaptiveAvgPool1d = function(inS,InC,output_size){
  return [inS[0],inS[1],output_size]
}
check_function.AdaptiveAvgPool2d = function(inS,InC,output_size){
  return [inS[0],inS[1],output_size[0],output_size[1]]
}
check_function.AdaptiveAvgPool3d = function(inS,InC,output_size){
  return [inS[0],inS[1],output_size[0],output_size[1],output_size[2]]
}

// Padding layers

check_function.ReflectionPad1d = function(inS,InC,P){
  return [inS[0],inS[1],inS[0]+P[0]+P[1]]
}
// padding_left, \text{padding\_right}padding_right, \text{padding\_top}padding_top, \text{padding\_bottom}padding_bottom
check_function.ReflectionPad2d = function(inS,InC,P){
  return [inS[0], inS[1], inS[2]+P[2]+P[3], inS[3]+P[0]+P[1]]
}
check_function.ReplicationPad1d = function(inS,InC,P){
  return [inS[0],inS[1],inS[0]+P[0]+P[1]]
}
// padding_left, \text{padding\_right}padding_right, \text{padding\_top}padding_top, \text{padding\_bottom}padding_bottom
check_function.ReplicationPad2d = function(inS,InC,P){
  return [inS[0], inS[1], inS[2]+P[2]+P[3], inS[3]+P[0]+P[1]]
}

check_function.ReplicationPad3d = function(inS,InC,P){
  return [inS[0], inS[1], inS[2]+P[4]+P[5], inS[3]+P[2]+P[3], inS[4]+P[0]+P[1]]
}

check_function.ZeroPad2d = function(inS,InC,P){
  return [inS[0], inS[1], inS[2]+P[2]+P[3], inS[3]+P[0]+P[1]]
}

check_function.ConstantPad1d = function(inS,InC,P){
  return [inS[0],inS[1],inS[0]+P[0]+P[1]]
}
// padding_left, \text{padding\_right}padding_right, \text{padding\_top}padding_top, \text{padding\_bottom}padding_bottom
check_function.ConstantPad2d = function(inS,InC,P){
  return [inS[0], inS[1], inS[2]+P[2]+P[3], inS[3]+P[0]+P[1]]
}

check_function.ConstantPad3d = function(inS,InC,P){
  return [inS[0], inS[1], inS[2]+P[4]+P[5], inS[3]+P[2]+P[3], inS[4]+P[0]+P[1]]
}

// Non-linear activations 
var OptNodes = ['ELU','Hardshrink','Hardtanh','LeakyReLU','LogSigmoid','PReLU','ReLU','ReLU6','RReLU','SELU','CELU','Sigmoid','Softplus','Softshrink','Softsign','Tanh','Tanhshrink','Threshold']

OptNodes.forEach(item => {
  check_function[item] = function(inS){
      return inS
    }
});
// Non-linear activations (other)
// https://pytorch.org/docs/stable/nn.html#adaptivelogsoftmaxwithloss

OptNodes = ['Softmin','Softmax','Softmax2d','LogSoftmax']
OptNodes.forEach(item => {
  check_function[item] = function(inS){
      return inS
    }
});

// Normalization layers
OptNodes = ['BatchNorm1d','BatchNorm2d','BatchNorm3d','GroupNorm','InstanceNorm1d','InstanceNorm2d','InstanceNorm3d','LayerNorm','LocalResponseNorm']
OptNodes.forEach(item => {
  check_function[item] = function(inS){
    return inS
  }
});


check_function.AdaptiveLogSoftmaxWithLoss = function(inS,in_features, n_classes){
  // IN (N,in_features)
  // in_features == inS[1]
  return [inS[0]]

}
// Recurrentreturn inS layers
// https://pytorch.org/docs/stable/nn.html#recurrent-layers
check_function.RNN = function(inS){
  return inS
}


check_function.LSTM = function(inS){
  return inS
}

check_function.GRU = function(inS){
  return inS
}
check_function.RNNCell = function(inS){
  return inS
}
check_function.LSTMCell = function(inS){
  return inS
}
check_function.GRUCell = function(inS){
  
}


// Linear layers
// https://pytorch.org/docs/stable/nn.html#linear-layers
// return inS
// Linear layers
check_function.Linear = function(inS){
  return inS
}
check_function.Bilinear = function(inS){
  
}


// Dropout layers

check_function.Dropout = function(inS){
  return inS
}
check_function.Dropout2d = function(inS){
  return inS
}
check_function.Dropout3d = function(inS){
  return inS
}
check_function.AlphaDropout = function(inS){
  return inS
}

// Sparse layers

check_function.Embedding = function(inS,embedding_dim){
  inS.push(embedding_dim)
  return inS
  return inS
}
check_function.EmbeddingBag = function(inS){
  
}
// Distance functions
// https://pytorch.org/docs/stable/nn.html#distance-functions
/**
 *(100, 128) (100, 128) =>(100)
 *
 * @param {*} inS
 * @param {*} inS2
 * @param {*} dim
 * @returns
 */
check_function.CosineSimilarity = function(inS,inS2,dim){
  delete inS1[dim]
  return inS1
  
}

check_function.PairwiseDistance = function(inS,keepdim=false){
  if(keepdim){
    delete inS[1]
  }else{
    inS[1] = 1
  }
  return inS
  
}
// Loss functions

check_function.baseLossShape = function(){
  if(reduce){
    return [1]
  }else{
    return inS1
  }
}


check_function.L1Loss = function(inS1,inS2){
  return inS1
}
check_function.MSELoss = function(inS1,inS2){
  return inS1
}
check_function.CrossEntropyLoss = function(inS1,inS2,reduce=true){
  if(reduce){
    return [1]
  }else{
    return inS1[0]
  }
}
check_function.CTCLoss = function(inS1,inS2){
  return inS1[0]
}
check_function.NLLLoss = function(inS1,inS2,reduce=true){
  if(reduce){
    return [1]
  }else{
    return inS1[0]
  }
}
check_function.PoissonNLLLoss = function(inS1,inS2,reduce=true){
  if(reduce){
    return [1]
  }else{
    return inS1[0]
  }
}

check_function.KLDivLoss = function(inS1,inS2,reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.BCELoss = function(inS1,inS2,reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.BCEWithLogitsLoss = function(inS1,inS2,reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.MarginRankingLoss = function(inS1,inS2,reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}

check_function.HingeEmbeddingLoss = function(inS1,inS2,reduce=true){
  if(reduce){
    return [1]
  }else{
    return inS1[0]
  }
}


check_function.MultiLabelMarginLoss = function(inS1, inS2,reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.SmoothL1Loss = function(inS1,inS2, reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.SoftMarginLoss = function(inS1,inS2, reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.MultiLabelSoftMarginLoss = function(inS1,inS2, reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.CosineEmbeddingLoss = function(inS1,inS2, reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.MultiMarginLoss = function(inS1,inS2, reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}
check_function.TripletMarginLoss = function(inS1,inS2, reduce=true){
  return baseLossShape(inS1,inS2,reduce)
}


// Vision layers
// https://pytorch.org/docs/stable/nn.html#vision-layers


check_function.PixelShuffle = function(inS,upscale_factor){
  if(inS[1]%(upscale_factor**2)!==0){
    console.warn('err:PixelShuffle Channel ')
  }
  return [inS[0],inS[1]/(upscale_factor**2),inS[2]*upscale_factor,inS[3]*upscale_factor]
}

/**
 *
 *  cal Upsample shape of output tenser 
 * @param {*} inS
 * @param {*} size
 * @param {*} scale_factor
 * @returns
 */
check_function.baseUpsample = function(inS, size, scale_factor){
  var outS = []
  outS.push(inS[0])
  if(size){
    for(var i=1;i<size.length;i++){
      outS.push(inS[i]*size[i])
    }
  }
  if(scale_factor){
    for(var i=1;i<size.length;i++){
      outS.push(inS[i]*scale_factor)
    }
  }
  return outS
}


check_function.Upsample = function(inS, size, scale_factor){
  return baseUpsample(inS, size, scale_factor)
}
check_function.UpsamplingNearest2d = function(inS, size, scale_factor){
  return baseUpsample(inS, size, scale_factor)
}
check_function.UpsamplingBilinear2d = function(inS, size, scale_factor){
  return baseUpsample(inS, size, scale_factor)
}

// DataParallel layers (multi-GPU, distributed)

// Vision functions

export {check_function}
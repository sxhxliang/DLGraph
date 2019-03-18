/**
 * config graph node schema data
 */
import {check_function} from '../utils/check_tensor_shape.js'
// import 

// var ndarray = require("ndarray")
//   , ops = require("ndarray-ops")

// var a = ndarray(new Float32Array(128*128))
// , b = ndarray(new Float32Array(128*128))
// , c = ndarray(new Float32Array(128*128))
const pytorchNodeMetas = [  {
"name": "Conv1d",
"schema": {
  "attributes": [
    {
      "name": "output_padding",
      "visible": false
    },
    {
      "name": "in_channels",
      "visible": false
    },
    {
      "name": "out_channels",
      "visible": false
    },
    {
      "default": 1,
      "name": "groups"
    },
    {
      "default": false,
      "name": "transposed"
    },
    {
      "default": [
        0
      ],
      "name": "padding"
    },
    {
      "default": [
        1
      ],
      "name": "dilation"
    },
    {
      "default": [
        1
      ],
      "name": "stride"
    },
    {
      "default": true,
      "name": "bias"
    }
  ],
  "category": "Layer",
  "package": "torch.nn.modules.conv"
}
},
{
"name": "ConvTranspose1d",
"schema": {
  "attributes": [
    {
      "name": "output_padding",
      "visible": false
    },
    {
      "name": "in_channels",
      "visible": false
    },
    {
      "name": "out_channels",
      "visible": false
    },
    {
      "default": 1,
      "name": "groups"
    },
    {
      "default": true,
      "name": "transposed"
    },
    {
      "default": [
        0
      ],
      "name": "padding"
    },
    {
      "default": [
        1
      ],
      "name": "dilation"
    },
    {
      "default": [
        1
      ],
      "name": "stride"
    },
    {
      "default": true,
      "name": "bias"
    }
  ],
  "category": "Layer",
  "package": "torch.nn.modules.conv"
}
},
{
"name": "Conv2d",
"schema": {
  "attributes": [
    {
      "name": "output_padding",
      "visible": false
    },
    {
      "name": "in_channels",
      "visible": false
    },
    {
      "name": "out_channels",
      "visible": false
    },
    {
      "default": 1,
      "name": "groups"
    },
    {
      "default": false,
      "name": "transposed"
    },
    {
      "default": [
        0,
        0
      ],
      "name": "padding"
    },
    {
      "default": [
        1,
        1
      ],
      "name": "dilation"
    },
    {
      "default": [
        1,
        1
      ],
      "name": "stride"
    },
    {
      "default": true,
      "name": "bias"
    }
  ],
  "category": "Layer",
  "package": "torch.nn.modules.conv"
}
},
{
"name": "ConvTranspose2d",
"schema": {
  "attributes": [
    {
      "name": "output_padding",
      "visible": false
    },
    {
      "name": "in_channels",
      "visible": false
    },
    {
      "name": "out_channels",
      "visible": false
    },
    {
      "default": 1,
      "name": "groups"
    },
    {
      "default": true,
      "name": "transposed"
    },
    {
      "default": [
        0,
        0
      ],
      "name": "padding"
    },
    {
      "default": [
        1,
        1
      ],
      "name": "dilation"
    },
    {
      "default": [
        1,
        1
      ],
      "name": "stride"
    },
    {
      "default": true,
      "name": "bias"
    }
  ],
  "category": "Layer",
  "package": "torch.nn.modules.conv"
}
},
{
"name": "Conv3d",
"schema": {
  "category": "Layer",
  "package": "torch.nn.modules.conv"
}
},
{
"name": "ConvTranspose3d",
"schema": {
  "category": "Layer",
  "package": "torch.nn.modules.conv"
}
},
{
"name": "Linear",
"schema": {
  "attributes": [
    {
      "default": true,
      "name": "bias"
    }
  ],
  "category": "Layer",
  "package": "torch.nn.modules.linear"
}
},
{
"name": "Sigmoid",
"schema": {
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "Softmax",
"schema": {
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "Tanh",
"schema": {
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "LogSoftmax",
"schema": {
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "ReLU",
"schema": {
  "attributes": [
    {
      "default": false,
      "name": "inplace",
      "visible": false
    },
    {
      "default": 0,
      "name": "threshold"
    },
    {
      "default": 0,
      "name": "value"
    }
  ],
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "ReLU6",
"schema": {
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "PReLU",
"schema": {
  "attributes": [],
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "ELU",
"schema": {
  "attributes": [],
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "Hardtanh",
"schema": {
  "attributes": [],
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "LeakyReLU",
"schema": {
  "attributes": [],
  "category": "Activation",
  "package": "torch.nn.modules.activation"
}
},
{
"name": "MaxPool1d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "MaxPool2d",
"schema": {
  "attributes": [
    {
      "default": 0,
      "name": "padding"
    },
    {
      "default": 1,
      "name": "dilation"
    },
    {
      "default": false,
      "name": "return_indices"
    },
    {
      "name": "ceil_mode",
      "visible": false
    }
  ],
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "MaxPool3d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "MaxUnpool1d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "MaxUnpool2d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "MaxUnpool3d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AvgPool2d",
"schema": {
  "attributes": [
    {
      "default": 0,
      "name": "padding"
    },
    {
      "default": true,
      "name": "count_include_pad"
    },
    {
      "name": "ceil_mode",
      "visible": false
    }
  ],
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AvgPool3d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AdaptiveAvgPool1d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AdaptiveAvgPool2d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AdaptiveAvgPool3d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AdaptiveMaxPool1d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AdaptiveMaxPool2d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "AdaptiveMaxPool3d",
"schema": {
  "category": "Pool",
  "package": "torch.nn.modules.pooling"
}
},
{
"name": "BatchNorm1d",
"schema": {
  "attributes": [],
  "category": "Normalization",
  "package": "torch.nn.modules.batchnorm"
}
},
{
"name": "BatchNorm2d",
"schema": {
  "attributes": [
    {
      "default": 1e-05,
      "name": "eps"
    },
    {
      "default": 0.1,
      "name": "momentum"
    },
    {
      "default": true,
      "name": "affine"
    },
    {
      "default": true,
      "name": "track_running_stats"
    }
  ],
  "category": "Normalization",
  "inputs": [
    {
      "name": "input"
    },
    {
      "name": "weight"
    },
    {
      "name": "bias"
    },
    {
      "name": "running_mean"
    },
    {
      "name": "running_var"
    },
    {
      "name": "num_batches_tracked"
    }
  ],
  "package": "torch.nn.modules.batchnorm"
}
},
{
"name": "GroupNorm",
"schema": {
  "category": "Normalization",
  "package": "torch.nn.modules.normalization"
}
},
{
"name": "LayerNorm",
"schema": {
  "category": "Normalization",
  "package": "torch.nn.modules.normalization"
}
},
{
"name": "Dropout2d",
"schema": {
  "attributes": [
    {
      "default": false,
      "name": "inplace",
      "visible": false
    },
    {
      "default": 0.5,
      "name": "p"
    }
  ],
  "category": "Dropout",
  "package": "torch.nn.modules.dropout"
}
},
{
"name": "Dropout",
"schema": {
  "attributes": [
    {
      "default": false,
      "name": "inplace",
      "visible": false
    },
    {
      "default": 0.5,
      "name": "p"
    }
  ],
  "category": "Dropout",
  "package": "torch.nn.modules.dropout"
}
},
{
"name": "GRU",
"schema": {
  "category": "Layer",
  "package": "torch.nn.modules.rnn"
}
},
{
"name": "GRUCell",
"schema": {
  "category": "Layer",
  "package": "torch.nn.modules.rnn"
}
},
{
"name": "LSTM",
"schema": {
  "attributes": [
    {
      "default": 0,
      "name": "dropout"
    },
    {
      "default": {},
      "name": "dropout_state"
    },
    {
      "default": 1,
      "name": "num_layers"
    },
    {
      "name": "batch_first",
      "visible": false
    },
    {
      "name": "bidirectional",
      "visible": false
    },
    {
      "name": "bias",
      "visible": false
    }
  ],
  "category": "Layer",
  "inputs": [
    {
      "name": "input"
    },
    {
      "name": "weight_ih_l0",
      "visible": false
    },
    {
      "name": "weight_hh_l0",
      "visible": false
    },
    {
      "name": "bias_ih_l0",
      "visible": false
    },
    {
      "name": "bias_hh_l0",
      "visible": false
    },
    {
      "name": "weight_ih_l1",
      "visible": false
    },
    {
      "name": "weight_hh_l1",
      "visible": false
    },
    {
      "name": "bias_ih_l1",
      "visible": false
    },
    {
      "name": "bias_hh_l1",
      "visible": false
    }
  ],
  "package": "torch.nn.modules.rnn"
}
},
{
"name": "LSTMCell",
"schema": {
  "category": "Layer",
  "package": "torch.nn.modules.rnn"
}
},
{
"name": "RNN",
"schema": {
  "category": "Layer",
  "package": "torch.nn.modules.rnn"
}
},
{
"name": "Embedding",
"schema": {
  "attributes": [
    {
      "default": 2,
      "name": "norm_type"
    },
    {
      "default": false,
      "name": "scale_grad_by_freq"
    },
    {
      "default": false,
      "name": "sparse"
    },
    {
      "default": null,
      "name": "max_norm"
    },
    {
      "default": null,
      "name": "padding_idx"
    }
  ],
  "category": "Transform",
  "package": "torch.nn.modules.sparse"
}
},
{
"name": "ReflectionPad1d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ReflectionPad2d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ReplicationPad1d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ReplicationPad2d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ReplicationPad3d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ZeroPad2d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ConstantPad1d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ConstantPad2d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "ConstantPad3d",
"schema": {
  "category": "Tensor",
  "package": "torch.nn.modules.padding"
}
},
{
"name": "PixelShuffle",
"schema": {
  "package": "torch.nn.modules.pixelshuffle"
}
},
{
"name": "InstanceNorm1d",
"schema": {
  "package": "torch.nn.modules.instancenorm"
}
},
{
"name": "InstanceNorm2d",
"schema": {
  "package": "torch.nn.modules.instancenorm"
}
},
{
"name": "InstanceNorm3d",
"schema": {
  "package": "torch.nn.modules.instancenorm"
}
}
]
const framework = 'pytorch'



var pytorchNodes = []
var i = 0
var nodeOpt
for(i in pytorchNodeMetas){
  // console.log(i)
  var item = pytorchNodeMetas[i]
  // console.log(item.name, check_function[item.name])
  nodeOpt = function(){
    this.addInput("in");
    this.addOutput("out");
    this.checkfunc = check_function[item.name];
  }

  nodeOpt.title = item.name;
  nodeOpt.desc = item.schema.package;
  nodeOpt.data = item.schema;
  // if(item.schema.attributes){
  //   var new_attributes = []
  //   item.schema.attributes.forEach(item => {
  //     // if(item.default){
  //     //   if(typeof item.default == 'object'){

  //     //   }
  //     // }
  //     new_attributes.push({
  //       'name':item.name,
  //       'default':'',
  //       'visible':'visible',
  //       'default_value':''
  //     })
      
  //   });
  //   item.schema.attributes = new_attributes
  // }
  // default_value
  // nodeOpt.data = item.schema

  nodeOpt.prototype.onExecute = function()
  {
    var v = this.getInputData(0);
    // var o = this.checkfunc(v)
    // console.log(this.title, o)
    
    this.setOutputData(0, v);
    
  }

  pytorchNodes.push({
    'menu_name':framework +'/'+ item.name,
    'name': item.name,
    'func':nodeOpt
  })

}
export {pytorchNodes, pytorchNodeMetas}

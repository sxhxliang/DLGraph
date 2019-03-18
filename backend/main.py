
# generate code
tmpl = open('./backend/template/pytorch/nn.graphtmpl','r').read()

from compile.CodeTemplate import Template

null = ''
true = True
false = False
graph = {"last_node_id":14,"last_link_id":14,"nodes":[{"id":2,"type":"graph/GlobalInput","pos":[165,9.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"outputs":[{"name":"input_426","type":null,"links":[1]}],"properties":{"name":"input_426","type":null}},{"id":3,"type":"pytorch/Conv1d","pos":[165,78.5],"size":{"0":138.75518798828125,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":1}],"outputs":[{"name":"out","links":[2]}],"properties":{"output_padding":"","in_channels":"","out_channels":"","groups":1,"transposed":false,"padding":[0],"dilation":[1],"stride":[1],"bias":true}},{"id":4,"type":"pytorch/BatchNorm1d","pos":[165,147.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":2}],"outputs":[{"name":"out","links":[3]}],"properties":{}},{"id":5,"type":"pytorch/ReLU","pos":[165,216.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":3}],"outputs":[{"name":"out","links":[4,13]}],"properties":{"inplace":false,"threshold":0,"value":0}},{"id":7,"type":"pytorch/Conv1d","pos":[70,285.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":4}],"outputs":[{"name":"out","links":[7]}],"properties":{"output_padding":"","in_channels":"","out_channels":"","groups":1,"transposed":false,"padding":[0],"dilation":[1],"stride":[1],"bias":true}},{"id":6,"type":"pytorch/Conv1d","pos":[260,286],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":13}],"outputs":[{"name":"out","links":[6]}],"properties":{"output_padding":"","in_channels":"","out_channels":"","groups":1,"transposed":false,"padding":[0],"dilation":[1],"stride":[1],"bias":true}},{"id":9,"type":"pytorch/BatchNorm1d","pos":[70,354.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":7}],"outputs":[{"name":"out","links":[9]}],"properties":{}},{"id":8,"type":"pytorch/BatchNorm1d","pos":[260,354.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":6}],"outputs":[{"name":"out","links":[8]}],"properties":{}},{"id":11,"type":"pytorch/ReLU","pos":[70,423.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":9}],"outputs":[{"name":"out","links":[11]}],"properties":{"inplace":false,"threshold":0,"value":0}},{"id":10,"type":"pytorch/ReLU","pos":[260,423.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":8}],"outputs":[{"name":"out","links":[10]}],"properties":{"inplace":false,"threshold":0,"value":0}},{"id":12,"type":"graph/GlobalOutput","pos":[70,492.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"output_698","type":0,"link":11}],"properties":{"name":"output_698","type":0}},{"id":13,"type":"graph/GlobalOutput","pos":[260,492.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"output_167","type":0,"link":10}],"properties":{"name":"output_167","type":0}}],"links":[[1,2,0,3,0,0],[2,3,0,4,0,0],[3,4,0,5,0,0],[4,5,0,7,0,0],[6,6,0,8,0,0],[7,7,0,9,0,0],[8,8,0,10,0,0],[9,9,0,11,0,0],[10,10,0,13,0,0],[11,11,0,12,0,0],[13,5,0,6,0,0]],"groups":[],"config":{}}

GraphNodes = []
inputs = []
outputs = []
orders = {}
GraphNodesMap ={}

links = graph['links']
for node in graph['nodes']:
    node_type = node['type'].split('/')[1]  
    opt = True

    # 
    if node_type == 'GlobalInput':
        opt = False
        inputs.append(node['properties']['name'])

    if node_type == 'GlobalOutput':
        opt = False
        outputs.append(node['properties']['name'])

        
    opt_node = {'type':node_type,'name':node_type+'_'+ str(node['id']),'opt':opt}

    if opt == False: continue

    params = []
    for key in node['properties']:
        # opt_node['params']
       
        if key in ['transposed','null','GlobalInput','GlobalOutput']: continue
        if str(node['properties'][key]) != '':
            param = key +'='+ str(node['properties'][key])
            # print(key,param)
            params.append(param)

    opt_node['params'] = ','.join(params)
    # print(opt_node['params'])
    
    GraphNodes.append(opt_node)
    GraphNodesMap[node['id']] = opt_node


for litem in links:
    ori = litem[1]
    taget = litem[3]
    # print('ori', ori, taget)
    if ori not in orders.keys():
        orders[ori]= {'inputs':[],'outputs':[]}
    orders[ori]['outputs'].append(litem[3])

    if taget not in orders.keys():
        orders[taget]= {'inputs':[],'outputs':[]}
    orders[taget]['inputs'].append(litem[1])

print('orders', orders ,'\n')
# exc order:


# print('GraphNodes', GraphNodes)
# print('GraphNodesMap',GraphNodesMap)
inputs = ','.join(inputs)
outputs = ','.join(outputs)


_context = {
    'PREFIX':'G_',
    'CLASSNAME': "ClassA",
    'OPTNODES': GraphNodes,
    'INPUTS': inputs,
    'OPTNODESMAP':GraphNodesMap,
    'ORDER':orders,
    'OUTPUTS':  '['+outputs+']'
}
print(_context)
print(Template(tmpl)(_context))
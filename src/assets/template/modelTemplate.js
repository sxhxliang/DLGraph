var template = `
        class {{PREFIX}}{{CLASSNAME}}(nn.Module):
            def __init__(self, target,):
                super({{PREFIX}}, self).__init__()

                {% for item in OPTNODES -%}
                {% if item['opt'] -%}
                self.{{PREFIX}}{{item['name']}} = {{item['type']}}({{item['params']}})
                {% endif -%}
                {% endfor %}

            def forward(self, {{INPUTS}} ):
                {% for item in FORWARDOPTS -%}
                {{item}}
                {% endfor %}
                return {{OUTPUTS}}
            `

export {template}
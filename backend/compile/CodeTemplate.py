# 文件名:CodeTemplate.py
# {{%,%}},{%,%}
from functools import reduce

TOKEN_TEXT = 0
TOKEN_LEFT_BARCE = 1
TOKEN_RIGHT_BRACE = 2
TOKEN_LEFT_VAR_BARCE = 3
TOKEN_RIGHT_VAR_BARCE = 4

class Token(object):
    def __init__(self, type, text):
        self.type = type
        self.text = text

def IDENT(id, type):
    length = len(id)
    def __(text):
        return (text.startswith(id), Token(type, id), length)
    return __

LBrace = IDENT("{%", TOKEN_LEFT_BARCE)
RBrace = IDENT("%}", TOKEN_RIGHT_BRACE)
LVarBrace = IDENT("{{%", TOKEN_LEFT_VAR_BARCE)
RVarBrace = IDENT("%}}", TOKEN_RIGHT_VAR_BARCE)

def T_OR(*args):
    def __(text):
        for it in args:
            ret = it(text)
            if ret[0]:
                return ret
        return (False, None, 0)
    return __

# 顺序有优先级,不能错
IDENTS = T_OR(LVarBrace, RVarBrace, LBrace, RBrace)

def ParseToken(text):
    tokenList = []
    start = 0
    index = 0
    while (True):
        subText = text[index:]
        if not subText:
            if text[start:]:
                tokenList.append(Token(TOKEN_TEXT, text[start:]))
            return tokenList
        flag, token, length = IDENTS(subText)
        if flag:
            if text[start:index]:
                tokenList.append(Token(TOKEN_TEXT, text[start:index]))
            tokenList.append(token)
            index += length
            start = index
        else:
            index += 1

# Grammar
SYNTAX_EMPTY = -1
SYNTAX_TEXT = 0
SYNTAX_VAR = 1
SYNTAX_BLOCK = 2
SYNTAX_STARTFOR_BLOCK = 3
SYNTAX_ENDFOR_BLOCK = 4
SYNTAX_STARTIF_BLOCK = 5
SYNTAX_ENDIF_BLOCK = 6
SYNTAX_FOR_BLOCK = 7
SYNTAX_IF_BLOCK = 8

class SyntaxNode(object):
    def __init__(self):
        self.type = 0
        self.token = None
        self.syntaxList = []
        self.render = None

def G_Orig(type, gtype=SYNTAX_EMPTY):
    def __(tokens):
        if not tokens:
            return (False, None, 0)
        if tokens[0].type == type:
            syntaxNode = SyntaxNode()
            syntaxNode.type = gtype
            syntaxNode.token = tokens[0]
            return (True, [syntaxNode], 1)
        else:
            return (False, None, 0)
    return __

def G_Pack(gtype, p2, *args):
    def __(tokens):
        syntaxNode = SyntaxNode()
        syntaxNode.type = gtype
        i = 0
        for g in args:
            flag, childNodeList, child_length = g(tokens[i:])
            if not flag:
                return (False, None, 0)
            syntaxNode.syntaxList.extend(filter(lambda it: it.type != SYNTAX_EMPTY, childNodeList))
            i += child_length
        if p2:
            syntaxNode = p2(syntaxNode)
        return (True, [syntaxNode], i)
    return __

def G_OR(*args):
    def __(tokens):
        for g in args:
            flag, childNodeList, child_length = g(tokens)
            if flag:
                return (True, childNodeList, child_length)
        return (False, None, 0)
    return __

# 0或多次匹配,不会匹配失败
def G_Repeat(g):
    def __(tokens):
        i = 0
        syntaxnodes = []
        while True:
            flag, childNodeList, child_length = g(tokens[i:])
            if not flag:
                return (True, syntaxnodes, i)
            syntaxnodes.extend(childNodeList)
            i += child_length
    return __

# 二次解析函数
def P2_VAR(syntaxNode):
    syntax = SyntaxNode()
    syntax.type = SYNTAX_VAR
    syntax.token = Token(TOKEN_TEXT, syntaxNode.syntaxList[0].token.text.strip())
    return syntax

def P2_BLOCK(syntaxNode):
    syntax = SyntaxNode()
    text = syntaxNode.syntaxList[0].token.text.strip()
    if text.startswith("for"):
        syntax.type = SYNTAX_STARTFOR_BLOCK
        syntax.token = Token(TOKEN_TEXT, text)
        return syntax
    if text == "endfor":
        syntax.type = SYNTAX_ENDFOR_BLOCK
        syntax.token = Token(TOKEN_TEXT, text)
        return syntax
    if text.startswith("if"):
        syntax.type = SYNTAX_STARTIF_BLOCK
        syntax.token = Token(TOKEN_TEXT, text)
        return syntax
    if text == "endif":
        syntax.type = SYNTAX_ENDIF_BLOCK
        syntax.token = Token(TOKEN_TEXT, text)
        return syntax
    return syntaxNode

G_Text = G_Orig(TOKEN_TEXT, SYNTAX_TEXT)
G_Var = G_Pack(SYNTAX_VAR, P2_VAR, G_Orig(TOKEN_LEFT_VAR_BARCE), G_Text, G_Orig(TOKEN_RIGHT_VAR_BARCE))
G_Block = G_Pack(SYNTAX_BLOCK, P2_BLOCK, G_Orig(TOKEN_LEFT_BARCE), G_Text, G_Orig(TOKEN_RIGHT_BRACE))
G_Code = G_Repeat(G_OR(G_Text, G_Var, G_Block))

# 二次解析语法
def G2_Orig(gtype,render=None):
    def __():
        def ___(syntaxs):
            if not syntaxs:
                return (False, None, 0)
            if syntaxs[0].type == gtype:
                if render :
                    syntaxs[0].render = render(syntaxs[0])
                return (True, [syntaxs[0]], 1)
            else:
                return (False, None, 0)
        return ___
    return __

def G2_OR(*args):
    def __():
        def ___(syntaxs):
            for g in args:
                flag, childNodeList, child_length = g()(syntaxs)
                if flag:
                    return (True, childNodeList, child_length)
            return (False, None, 0)
        return ___
    return __

def G2_Pack(gtype,render, *args):
    def __():
        def ___(syntaxs):
            syntaxNode = SyntaxNode()
            syntaxNode.type = gtype
            i = 0
            for g in args:
                flag, childNodeList, child_length = g()(syntaxs[i:])
                if not flag:
                    return (False, None, 0)
                syntaxNode.syntaxList.extend(childNodeList)
                i += child_length
            if render :
                    syntaxNode.render = render(syntaxNode)
            return (True, [syntaxNode], i)

        return ___
    return __

def G2_Repeat(g):
    def __():
        def ___(syntaxs):
            i = 0
            syntaxnodes = []
            while True:
                flag, childNodeList, child_length = g()(syntaxs[i:])
                if not flag:
                    return (True, syntaxnodes, i)
                syntaxnodes.extend(childNodeList)
                i += child_length
        return ___
    return __

#渲染函数
def RenderText(syntax):
    def __(context):
        return syntax.token.text
    return __

def RenderVar(syntax):
    code = compile(syntax.token.text.strip(),'RenderVar','eval')
    def __(context):
        return str(eval(code,None,context))
    return __

def _CompileFOR_IF(block,context):
    cmd  = "def __render(syntax):\n"
    cmd += "  def __(context):\n"
    cmd += reduce(lambda a, b: a + b,map(lambda it: "    {0}=context['{0}']\n".format(it), filter(lambda it: type(it) == str, context)), '')
    cmd += "    scope = context.copy()\n"
    cmd += "    ret = ''\n"
    cmd += "    local1 = locals().copy()\n"
    cmd += "    " + block + ":\n" #IF/FOR
    cmd += "      local2 = locals().copy()\n"
    cmd += "      reduce(lambda acc,it: local2.pop(it),map(lambda it:it,local1),None)\n"
    cmd += "      scope.update(local2)\n"
    cmd += "      ret += reduce(lambda a, b: a + b,map(lambda it:it.render(scope),filter(lambda it:it.render,syntax.syntaxList[1:])),'')\n"
    cmd += "    return ret\n"
    cmd += "  return __\n"
    code = compile(cmd,'_CompileFOR_IF','exec')
    ret = {}
    exec(code,None,ret)
    return ret['__render']

def RenderFOR(syntax):
    def __(context):
        __render = _CompileFOR_IF(syntax.syntaxList[0].token.text,context)
        return __render(syntax)(context)
    return __

def RenderIF(syntax):
    def __(context):
        __render = _CompileFOR_IF(syntax.syntaxList[0].token.text,context)
        return __render(syntax)(context)
    return __

G2_Text = G2_Orig(SYNTAX_TEXT,RenderText)
G2_Var = G2_Orig(SYNTAX_VAR,RenderVar)
G2_FOR = None
G2_IF = None
G2_FOR = G2_Pack(SYNTAX_FOR_BLOCK,RenderFOR, G2_Orig(SYNTAX_STARTFOR_BLOCK),
                 G2_Repeat(G2_OR(G2_Text, G2_Var, lambda: G2_FOR(), lambda: G2_IF())), G2_Orig(SYNTAX_ENDFOR_BLOCK))
G2_IF = G2_Pack(SYNTAX_IF_BLOCK,RenderIF, G2_Orig(SYNTAX_STARTIF_BLOCK),
                G2_Repeat(G2_OR(G2_Text, G2_Var, lambda: G2_FOR(), lambda: G2_IF())), G2_Orig(SYNTAX_ENDIF_BLOCK))
G2_Code = G2_Repeat(G2_OR(G2_Text, G2_Var, G2_FOR, G2_IF))

def PrintTokens(tokens):
    for it in tokens:
        print(it.type, it.text)

def PrintSyntaxs(syntaxs):
    for syntax in syntaxs:
        print("type:" + str(syntax.type))

def Template(text):
    tokens = ParseToken(text)
    gs = G2_Code()(G_Code(tokens)[1])[1]
    def __(context):
        _text = reduce(lambda a,b:a+b,map(lambda it: it.render(context),gs),'')
        return reduce(lambda acc,it: acc+it+'\n',filter(lambda it: it.strip(),_text.split('\n')),'')
    return __

import numpy as np
import pandas as pd
import csv
import json
import matplotlib.pyplot as pt
from sklearn.linear_model import LinearRegression
from collections import OrderedDict
from flask import Flask, render_template, request
app = Flask (__name__)
data=pd.read_csv('training_data.csv')
features=data[['Growth Rate(%)','Market Cap(Rs Crs)','D/E ratio']]
target=data['Rank']
model=LinearRegression()
model.fit(features,target)
test_data=pd.read_csv('testing_data.csv')
last_row=test_data.tail(1)

sectors=['IT','Pharmaceuticals','Finance','FMCG']
aggr={}
for sector in sectors:
    t=test_data.filter(like=sector).dropna()
    companies=t[sector].values.tolist()
    prod=0
    sum=0
    for company in companies:
        d=last_row.filter(like=company)
        li=[]
        columns=list(d)
        for j in columns:
            li.append(float(d[j][len(test_data.index)-1]))
        sum+=li[1]
        prod+=li[0]*li[1]
    aggr[sector]=round(prod/sum,2)

@app.route('/')
def index1():
    return render_template('register.html')
@app.route('/login')
def index4():
    return render_template('login.html')
@app.route('/main')
def index():
    return render_template('main.html')
@app.route('/bucket')
def index2():
    return render_template('bucket.html', aggr=aggr)
@app.route('/pass')
def index3():
    return render_template('pass.html')
@app.route('/',methods=['POST'])
def getvalue():
    name=request.form['name']
    age=request.form['age']
    number=request.form['number']

    var=name
    inv=float(age)
    num=float(number)
    field=test_data.filter(like=var).dropna()
    res={}
    for index,row in field.iterrows():
        company=test_data.filter(like=row[var]).tail(1)
        i=1
        li=[]
        columns=list(company)
        for j in columns:
            li.append(float(company[j][len(test_data.index)-1]))
        res[row[var]]=model.predict([li]).flat[0]
    keys=list(res.keys())
    values=list(res.values())
    sorted_value_index=np.argsort(values)
    sorted_dict={keys[i]:values[i] for i in sorted_value_index}
    new_dict={}
    with open('sample.csv', 'r') as csvfile:
        csv_dict = [row for row in csv.DictReader(csvfile)]
        if len(csv_dict)!=0:
            new_data=pd.read_csv('sample.csv')
            new_data.dropna(inplace=True)
            new_dict=new_data.to_dict()
    csvfile.close()
    filename="sample.csv"
    f=open(filename,"w+")
    f.close()
    final={}
    den=num*(num+1)/2
    for key in sorted_dict:
        if key in new_dict:
            final[key]=round(inv*num/den+new_dict[key][0],2)
        else:
            final[key]=round(inv*num/den,2)
        num-=1
        if num==0:
            break
    for key in new_dict:
        if key in final:
            continue
        else:
            v=new_dict[key][0]
            if v!=0:
                final[key]=v
    a=pd.DataFrame([final])
    a.to_csv('sample.csv')
    graph={}
    for key, value in final.items():
        s=key+'.1'
        field=test_data[[s]].drop(0)
        y=field[s].values.tolist()
        values = [eval(i) for i in y]
        graph[key]=values
    field=test_data[['Date']].drop(0)
    y=field['Date'].values.tolist()
    graph['Date']=y
    return render_template('pass.html', dict=final, graph=graph)
    # @app.route('/result')
    # def page3():
    #     return render_template('pass.html')

@app.route('/pass/test',methods=['POST'])
def test():
    output=request.get_json()
    result=json.loads(output)
    new_data=pd.read_csv('sample.csv')
    new_data.dropna(inplace=True)
    new_dict=new_data.to_dict()
    filename="sample.csv"
    f=open(filename,"w+")
    f.close()
    final={}
    for key in new_dict:
        if key==result['key1']:
            continue
        elif new_dict[key][0]==0:
            continue
        else:
            final[key]=new_dict[key][0]
    print(final)
    a=pd.DataFrame([final])
    a.to_csv('sample.csv')
    return result
    
if __name__ == '__main__':
    app.run(debug=True)

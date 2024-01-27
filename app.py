from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

datos = pd.read_csv("./proyecto2.0/DATOS_ESTRES -Universidades.csv")
datos = datos.drop(["Unnamed: 0", "DEPARTAMENTO", "UNIVERSIDAD", "DNI"], axis=1)

dummies_sex = pd.get_dummies(datos["SEXO"], drop_first=True)
datos = pd.concat([datos, dummies_sex], axis=1)
datos = datos.drop(["SEXO"], axis=1)
datos.rename(columns={'MASCULINO': 'SEXO'}, inplace=True)

X = datos[['EDAD', 'SEXO']]
y = datos['NIVEL DE ESTRES']

X_ent, X_pru, y_ent, y_pru = train_test_split(X, y, test_size=0.2, random_state=42)

modelo = DecisionTreeClassifier(random_state=42)
modelo.fit(X_ent, y_ent)

@app.route('/')
def index():
    return render_template('index.html', resultado="")

@app.route('/predecir', methods=['POST'])
def predecir():
    if request.method == 'POST':
        edad = int(request.form['edad'])
        sexo = int(request.form['sexo'])

        nueva_persona = [[edad, sexo]]
        prediccion = int(modelo.predict(nueva_persona)[0])  

        resultado = {"Nivel_de_estres": prediccion}

        print("Solicitud recibida. Edad:", edad, "Sexo:", sexo, "Predicción:", prediccion)
        
        return jsonify(resultado)

    return jsonify({"error": "Método no permitido"}), 405

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

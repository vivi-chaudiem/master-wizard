from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import json

# Production steps chain
def run_production_steps_chain(llm, product):
    template = "Welche Fertigungslinien bzw. Arbeitsschritte könnten in der Produktion von dem Produkt {product} vorkommen? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."

    formatted_template = template.format(
        product=product
        )

    prompt = PromptTemplate(
        input_variables=["product"], 
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)

    return chain.run({"product": product})

# Roles chain
def run_roles_chain(llm, product, production_steps):
    template = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Arbeitsschritte {production_steps}. Welche Rollen könnte es jede dieser Arbeitsschritte geben? (Beispiel: Zu dem Produktionsschritt 'Montage' könnte es die Rolle 'Monteur' geben.) Bitte gib eine Liste ohne zusätzliche Erklärungen, ohne Dopplungen und ohne den dazugehörigen Produktionsschritt aus. Beginne deine Antwort direkt mit der Aufzählung (1., 2., etc.)."

    formatted_template = template.format(
        product=product,
        production_steps=production_steps
        )

    prompt = PromptTemplate(
        input_variables=["product", "production_steps"], template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)

    return chain.run({"product": product, "production_steps": production_steps})

# Skills chain
def run_skills_chain(llm, product, roles, production_steps, background_info, json_template):
    template = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Rollen: {roles} und die zu folgenden Arbeitsschritten gehören: {production_steps}. Außerdem gibt es folgende Kompetenzkategorien mit folgenden Definitionen: {background_info}. Bitte gib mir für die erste Rolle eine Liste an Fähigkeiten aus, die in den vorgegeben Kompetenzkategorien eingeordnet sind. Bitte strukturiere die Antwort gemäß der folgenden JSON-Vorlage für jede einzigartige Rolle:\n"

    formatted_template = template.format(
        product=product,
        roles=roles,
        production_steps=production_steps,
        background_info=background_info
        ) + json_template
    
    prompt = PromptTemplate(
        input_variables=["product", "roles", "production_steps", "background_info"],
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)

    return chain.run({"product": product, "roles": roles, "production_steps": production_steps, "background_info": background_info})

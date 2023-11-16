# from flask import Flask
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain
import dotenv
import os
import openai

# Create Flask app
# app = Flask(__name__)

# # Prompt templates
# class ProductionStepsPromptTemplate(PromptTemplate):
#     def generate_prompt(self, data):
#         return {
#             "prompt": f"Wie wäre ein Werk aufgebaut, welches {data['product']} produziert? Bitte gib eine Liste ohne zusätzliche Erklärungen aus.",
#             "max_tokens": 150
#         }

def main():
    # Load environment variables
    dotenv.load_dotenv()

    # Set OpenAI API key and create LLM
    openai.api_key = os.getenv("OPEN_AI_API_KEY")
    llm = OpenAI(openai_api_key=openai.api_key)

    # Initial user input
    product = input("Welches Produkt wird in dem Werk produziert? ")

    # 1. Chain: Production steps

    # Create prompt template
    production_steps_template_str = "Welche Fertigungslinien bzw. Arbeitsschritte könnten in der Produktion von dem Produkt {product} vorkommen? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."
    formatted_production_steps_template = production_steps_template_str.format(product=product)
    
    # Create prompt
    prompt_production_steps = PromptTemplate(
        input_variables=["product"], template=formatted_production_steps_template
    )

    # Chain for production steps
    production_steps_chain = LLMChain(llm=llm, prompt=prompt_production_steps)

    # Define input variables for the chain
    input_variables = {"product": product}

    # Get production steps from OpenAI
    production_steps_response = production_steps_chain.run(input_variables)
    print("\nArbeitsschritte:")
    print(production_steps_response)

    # 2. Chain: Roles

    # Create prompt template
    roles_template_str = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Arbeitsschritte {production_steps}. Welche Rollen könnte es jede dieser Arbeitsschritte geben? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."
    formatted_roles_template = roles_template_str.format(product=product, production_steps=production_steps_response)

    # Create prompt
    prompt_roles = PromptTemplate(
        input_variables=["product", "production_steps"], template=formatted_roles_template
    )

    # Chain for roles
    roles_chain = LLMChain(llm=llm, prompt=prompt_roles)

    # Define input variables for the chain
    input_variables = {"product": product, "production_steps": production_steps_response}

    # Get roles from OpenAI
    roles_response = roles_chain.run(input_variables)
    print("\nRollen:")
    print(roles_response)

    # 3. Chain Skills

    # Create prompt template
    skills_template_str = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende folgende Rollen {roles}. Bitte gib eine Liste mit relevanten Fähigkeiten und ohne zusätzliche Erklärungen aus, die jede dieser Rollen benötigt."
    formatted_skills_template = skills_template_str.format(product=product, roles=roles_response)

    # Create prompt
    prompt_skills = PromptTemplate(
        input_variables=["product", "roles"], template=formatted_skills_template
    )

    # Chain for skills
    skills_chain = LLMChain(llm=llm, prompt=prompt_skills)

    # Define input variables for the chain
    input_variables = {"product": product, "roles": roles_response}

    # Get skills from OpenAI
    skills_response = skills_chain.run(input_variables)
    print("\nFähigkeiten:")
    print(skills_response)

if __name__ == '__main__':
   main()
import json

def read_file(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}")
        return None
    
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
    
def validate_steps(steps, name):
    steps_list = steps.split('\n')
    
    while True:
        print("\n" + name + ":")
        for idx, step in enumerate(steps_list, start=1):
            print(f"{idx}. {step}")

        print("\nMöchtest du Schritte hinzufügen, entfernen oder ersetzen?")
        user_choice = input("Wähle '1 zum Hinzufügen', '2 zum Entfernen', '3 zum Ersetzen' oder '4 zum Bestätigen': ").lower()

        if user_choice == '1':
            additional_step = input("Bitte gib den hinzuzufügenden Schritt ein: ")
            steps_list.append(additional_step)

        elif user_choice == '2':
            remove_idx = int(input("Bitte gib die Nummer des zu entfernenden Schritts ein: ")) - 1
            if 0 <= remove_idx < len(steps_list):
                del steps_list[remove_idx]

        elif user_choice == '3':
            replace_idx = int(input("Bitte gib die Nummer des zu ersetzenden Schritts ein: ")) - 1
            if 0 <= replace_idx < len(steps_list):
                new_step = input("Bitte gib den neuen Schritt ein: ")
                steps_list[replace_idx] = new_step

        elif user_choice == '4':
            break
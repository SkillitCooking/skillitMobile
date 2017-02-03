'use strict';

angular.module('main')
  .constant('Config', {
    ENV: {
        /*inject-env*/
        'SERVER_URL': 'https://skillicookingprodapi.info/api/',
    'CHANNEL': 'production',
    'API_PASSWORD': 'sm@34MLPG9L&rWph|YMwcg=&5|R3TMZ!!H+F48ThGFl56E&*RD'
        /*endinject*/
    },
    BUILD : {
        /*inject-build*/
        /*endinject*/
    }
  })
  .constant('COMPATIBILITY', {
    'VERSION': 2
  })
  .constant('NAME_FORM_FLAGS', {
    'SINGULAR': 'singularForm',
    'STANDARD': 'standardForm',
    'PLURAL': 'pluralForm'
  })
  .constant('STEP_TYPES', {
    'BAKE': 'Bake',
    'BOIL': 'Boil',
    'BRINGTOBOIL': 'BringToBoil',
    'BREAKEGG': 'BreakEgg',
    'COOK': 'Cook',
    'CUSTOM': 'Custom',
    'CUT': 'Cut',
    'DRY': 'Dry',
    'EQUIPMENTPREP': 'EquipmentPrep',
    'HEAT': 'Heat',
    'MOVE': 'Move',
    'PLACE': 'Place',
    'PREHEAT': 'PreheatOven',
    'REMOVE': 'Remove',
    'SAUTEE': 'Saute',
    'SEASON': 'Season',
    'SERVE': 'Serve',
    'SLOWCOOK': 'SlowCook',
    'STEAM': 'Steam',
    'STIR': 'Stir'
  }).constant('CUT_STEP_NAMES', {
    'DICE' : 'Dice',
    'DICED' : 'Diced',
    'CUT' : 'Cut',
    'CHOP' : 'Chop',
    'CHOPPED' : 'Chopped',
    'SLICE' : 'Slice',
    'SLICED' : 'Sliced',
    'MINCE' : 'Mince',
    'MINCED' : 'Minced'
  }).constant('INGREDIENT_CATEGORIES', {
    'VEGETABLES': 'Vegetables',
    'PROTEIN': 'Protein',
    'STARCH': 'Starches',
    'OTHER': 'Other'
  }).constant('RECIPE_TYPES', {
    'FULL': 'Full',
    'BYO': 'BYO',
    'ALACARTE': 'AlaCarte'
  }).constant('RECIPE_DISCLAIMERS', {
    'MODIFIED': 'Recipe has been modified to fit your ingredient selection'
  }).constant('TEXT_CHUNK_SIGNALS', {
    'NEWBULLET': '\n-',
    'OPENULIST': '%%%%%UB%%%%%',
    'CLOSEULIST': '%%%%%UE%%%%%',
    'OPENOLIST': '%%%%%OB%%%%%',
    'CLOSEOLIST': '%%%%%OE%%%%%',
    'NOLIST': 'NOLIST'
  }).constant('CONTENT_PIECE_TYPES', {
    'TEXT': 'text',
    'PICTURE': 'picture',
    'VIDEO': 'video'
  }).constant('ITEM_TYPES', {
    'NONE': 'None',
    'TIP': 'tip',
    'HOWTOSHOP': 'howToShop',
    'GLOSSARY': 'glossary',
    'TRAININGVIDEO': 'trainingVideo'
  }).constant('INPUTCATEGORIES', {
    'NOSUBCATEGORY': 'None'
  }).constant('EXIT_POPUP', {
    'TITLE': 'Exit Skillit?',
    'TEXT': 'Do you want to close and exit Skillit?'
  }).constant('LOGIN', {
    'MIN_PASSWORD_LENGTH': 8,
    'EMAIL_REGEX': /[^\s@]+@[^\s@]+\.[^\s@]+/,
    'EMAIL_CONFLICT': 'conflict_email',
    'EMAIL_CONFLICT_MESSAGE': 'A user with the supplied email already exists!',
    'PASSWORD_REQUIRED': 'required_password',
    'PASSWORD_REQUIRED_MESSAGE': 'To sign up, you need a password',
    'EMAIL_REQUIRED': 'required_email',
    'EMAIL_REQUIRED_MESSAGE': 'To sign up, you need an email',
    'USERNAME_CONFLICT': 'required_username',
    'USERNAME_CONFLICT_MESSAGE': 'A user with the supplied username already exists!',
    'INVALID_EMAIL': 'invalid_email',
    'INVALID_EMAIL_MESSAGE': 'To sign up, you need to supply a valid email address',
    'BASIC': 'basic',
    'FACEBOOK': 'facebook',
    'GOOGLE': 'google',
    'TYPE': 'type',
    'SOCIALTOKEN': 'socialtoken'
  }).constant('USER', {
    'ID': 'userId',
    'AGES': ['teens', 'twenties', 'thirties', 'forties', 'fifties +']
  }).constant('RECIPE_BADGES', {
    'GLUTEN_FREE': 'main/assets/images/recipe_badges/gluten-free.png',
    'GLUTEN_FREE_NAME': 'Gluten Free',
    'LEAN_PROTEIN': 'main/assets/images/recipe_badges/lean-protein.png',
    'LEAN_PROTEIN_NAME': 'Lean Protein',
    'PALEO': 'main/assets/images/recipe_badges/paleo.png',
    'PALEO_NAME': 'Paleo',
    'PESCATARIAN': 'main/assets/images/recipe_badges/seafood.png',
    'PESCATARIAN_NAME': 'Pescatarian',
    'QUICK_EATS': 'main/assets/images/recipe_badges/ready-soon.png',
    'QUICK_EATS_NAME': 'Ready Soon',
    'VEGAN': 'main/assets/images/recipe_badges/vegan.png',
    'VEGAN_NAME': 'Vegan',
    'VEGETARIAN': 'main/assets/images/recipe_badges/vegatarian.png',
    'VEGETARIAN_NAME': 'Vegetarian'
 }).constant('INTRO_SLIDES', [
    {
        'header': 'Input Ingredients',
        'subtitle': 'Tell us what you want to cook with and we\'ll show you what you can make',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/input-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/ingredients.png'
    },
    {
        'header': 'Select Recipe',
        'subtitle': 'Choose one of our recipes or use \'Build Your Own\' to make your perfect dish',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/selection-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/selection.png'
    },
    {
        'header': 'Customize Away',
        'subtitle': 'Feeling hungry? Add some sides. Feeling adventurous? Try different spices.',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/present-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/present.png'
    },
    {
        'header': 'Learn As You Go',
        'subtitle': 'Watch recipe overview videos and tap on certain steps for more info',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/present-steps-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/present-steps.png'
    },
    {
        'header': 'Discover',
        'subtitle': 'Not sure what you want to cook with? Browse different recipe collections.',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/browse-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/browse.png'
    }
  ]).constant('PAGINATION', {
    'ITEMS_PER_PAGE': 25
  }).constant('MEALS_COOKED_SOURCE', {
    'COOK_TAB': 0,
    'RECIPES_TAB': 1,
    'FAVORITE': 2
  }).constant('SHARING', {
    'MESSAGE1': 'I just cooked ',
    'MESSAGE2': ' using Skillit!',
    'IMAGE': 'main/assets/images/skillit-orange-text.png',
    'SUBJECT': 'Skillin\' it',
    'LINK': 'https://skillitcooking.com/pages/app',
    'HASHTAG': '#skillingit'
  }).constant('LOADING', {
    'TEMPLATE': '<p>Brainstorming</p><ion-spinner></ion-spinner>',
    'UPDATE_TEMPLATE': '<p>Updating App</p><ion-spinner></ion-spinner>'
  }).constant('KEYS', {
    'BLANK': 'blank'
  });
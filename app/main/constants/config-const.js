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
    'VERSION': 3
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
    'VEGETABLES_DISPLAY': 'Got Any Veggies?',
    'PROTEIN': 'Protein',
    'PROTEIN_DISPLAY': 'How About Protein?',
    'STARCH': 'Starches',
    'STARCH_DISPLAY': 'What Else?',
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
    'GLUTEN_FREE_NAME': 'G-F',
    'LEAN_PROTEIN': 'main/assets/images/recipe_badges/lean-protein.png',
    'LEAN_PROTEIN_NAME': 'Protein+',
    'PALEO': 'main/assets/images/recipe_badges/paleo.png',
    'PALEO_NAME': 'Paleo',
    'PESCATARIAN': 'main/assets/images/recipe_badges/seafood.png',
    'PESCATARIAN_NAME': 'Seafood',
    'QUICK_EATS': 'main/assets/images/recipe_badges/ready-soon.png',
    'QUICK_EATS_NAME': 'Quick',
    'VEGAN': 'main/assets/images/recipe_badges/vegan.png',
    'VEGAN_NAME': 'Vegan',
    'VEGETARIAN': 'main/assets/images/recipe_badges/vegatarian.png',
    'VEGETARIAN_NAME': 'Veggie'
 }).constant('INTRO_SLIDES', [
    {
        'header': 'Input Ingredients',
        'subtitle': 'Tell us what you got',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/input-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/ingredients.png'
    },
    {
        'header': 'Browse Recipes',
        'subtitle': 'We\'ll show what you can make',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/selection-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/selection.png'
    },
    {
        'header': 'Get Your Grub On',
        'subtitle': 'Click on steps for extra info',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/present-white.jpg',
        'screenshot_android': 'main/assets/images/android_walkthrough/present.png'
    }
  ]).constant('PAGINATION', {
    'ITEMS_PER_PAGE': 25,
    'RECIPES_PAGE_SIZE': 7
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
    'DEFAULT_TEMPLATE': '<p>Simmering</p><ion-spinner></ion-spinner>',
    'FETCHING_TEMPLATE': '<p>Brainstorming</p><ion-spinner></ion-spinner>',
    'COOKING_TEMPLATE': '<p>Prepping</p><ion-spinner></ion-spinner>',
    'UPDATE_TEMPLATE': '<p>Updating App</p><ion-spinner></ion-spinner>',
    'TIMEOUT': 400
  }).constant('KEYS', {
    'BLANK': 'blank'
  }).constant('FAREWELL_COPY', [
    'Get Your Grub On!',
    'Time To Eat!',
    'Get Ready To Feast!',
    'Grab a Fork and Dig In!',
    'Grab a Spork and Dig In!',
    'Enjoy Your Edible Masterpiece!',
    'It\'s Eating Time!',
    'Let\'s Grub!'
  ]);
'use strict';

angular.module('main')
  .constant('Config', {
    ENV: {
        /*inject-env*/
        'SERVER_URL': 'http://138.68.45.225:3000/api/',
    'CHANNEL': 'production'
        /*endinject*/
    },
    BUILD : {
        /*inject-build*/
        /*endinject*/
    }
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
    'COOK': 'Cook',
    'CUSTOM': 'Custom',
    'CUT': 'Cut',
    'DRY': 'Dry',
    'EQUIPMENTPREP': 'EquipmentPrep',
    'HEAT': 'Heat',
    'PLACE': 'Place',
    'PREHEAT': 'PreheatOven',
    'SAUTEE': 'Saute',
    'SEASON': 'Season',
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
    'GOOGLE': 'google'
  }).constant('USER', {
    'ID': 'userId',
    'AGES': ['teens', 'twenties', 'thirties', 'forties', 'fifties +']
  }).constant('RECIPE_BADGES', {
    'EASY_CLEANUP': 'main/assets/images/recipe_badges/rounded-rectangle-easy-cleanup.jpg',
    'LEAN_PROTEIN': 'main/assets/images/recipe_badges/rounded-rectangle-lean-protein.jpg',
    'MINIMAL_PREP': 'main/assets/images/recipe_badges/rounded-rectangle-minimal-prep.jpg',
    'PALEO': 'main/assets/images/recipe_badges/rounded-rectangle-paleo.jpg',
    'PESCATARIAN': 'main/assets/images/recipe_badges/rounded-rectangle-pescatarian.jpg',
    'QUICK_EATS': 'main/assets/images/recipe_badges/rounded-rectangle-quick-eats.jpg',
    'REDUCETARIAN': 'main/assets/images/recipe_badges/rounded-rectangle-reducetarian.jpg',
    'VEGAN': 'main/assets/images/recipe_badges/rounded-rectangle-vegan.jpg',
    'VEGETARIAN': 'main/assets/images/recipe_badges/rounded-rectangle-vegetarian.jpg',
    'WELL_ROUNDED': 'main/assets/images/recipe_badges/rounded-rectangle-well-rounded.jpg'
 }).constant('INTRO_SLIDES', [
    {
        'header': 'Input Ingredients',
        'subtitle': 'Tell us what you want to cook with and we\'ll show you what you can make',
        'screenshot_ios': 'main/assets/images/ios-walkthrough/ingredients-1.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/android_walkthrough/ingredients-1.png'
    },
    {
        'header': 'Select Recipe',
        'subtitle': 'Choose one of our recipes or use \'Build Your Own\' to make your perfect dish',
        'screenshot_ios': 'main/assets/images/ios-walkthrough/selection-2.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/selection-2.png'
    },
    {
        'header': 'Customize Away',
        'subtitle': 'Feeling hungry? Add some sides. Feeling adventurous? Try different spices.',
        'screenshot_ios': 'main/assets/images/ios-walkthrough/present-3.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/present-3.png'
    },
    {
        'header': 'Learn As You Go',
        'subtitle': 'Watch recipe overview videos and tap on certain steps for more info',
        'screenshot_ios': 'main/assets/images/ios-walkthrough/present-instructions-4.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/present-instructions-4.png'
    },
    {
        'header': 'Discover',
        'subtitle': 'Not sure what you want to cook with? Browse different recipe collections.',
        'screenshot_ios': 'main/assets/images/ios-walkthrough/browse-5.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/browse-5.png'
    },
    {
        'header': 'Educate Yo\'Self',
        'subtitle': 'Learn what you need to know to skillit in the kitchen',
        'screenshot_ios': 'main/assets/images/ios-walkthrough/learn-6.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/learn-6.png'
    }
  ]);
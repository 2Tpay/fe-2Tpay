function OnRun($rootScope, AppSettings, $state, SessionService, UserService) {
  'ngInject';

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', (event, toState) => {
    $rootScope.pageTitle = '';

    if (toState.title) {
      $rootScope.pageTitle += toState.title;
      $rootScope.pageTitle += ' \u2014 ';
    }

    $rootScope.pageTitle += AppSettings.appTitle;
    if (Object.keys(localStorage).length >= 1 && toState.name != 'Login') {
        $('#mySidenavN').removeClass('hidden');
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState){
    let session = SessionService.getSession();

    if(!session && toState.name !== 'Login'){
      event.preventDefault();
      $state.go('Login', { redirected: true });
    }
    checker(toState);
 })

 
 setInterval(() => {
   let session = SessionService.getSession();
   if($state.current.name !== 'Login' && !session){
     $state.go('Login', { redirected: true });
   }
 }, 3000);

 $('.navList li').click(function() {
  // $state.go('Login', { redirected: true })
    var isValid = $(this).hasClass('State');
    if (isValid) {
      let goState = $(this).attr('id');
      if (goState === 'Login') {
        $('#mySidenavN').addClass('hidden');
        let promise = UserService.logout();
        
        promise.then(()=>{
          SessionService.removeSession();
        })
        .catch(()=>{
          console.log('Invalid Token');
        })
      }
      $state.go(goState, {redirected: true});
    }
  });

  let checker = (toState) => {
     if (toState.name !== 'Login' && toState.name !== 'Client') {
        $('#sidebar-ico').css({
          'top': '.5%',
          'left': '1%',
          'color': '#000'
        })
     } else if (toState.name === 'Client') {
      $('#sidebar-ico').css({
          'top': '2.5%',
          'left': '4%',
          'color': '#fff'
        })
     }
   };

}

export default OnRun;
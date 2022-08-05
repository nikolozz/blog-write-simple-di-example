import 'reflect-metadata'

interface ClassType<T> {
  new (...args: any[]): T
}

function Injectable() {
  return function <T>(target: ClassType<T>) {}
}

@Injectable()
class Greeter {
  hello() {
    return 'Hello'
  }
}

@Injectable()
class WelcomeMessageGenerator {
  constructor(private greeter: Greeter) {}

  getMessage() {
    const greeting = this.greeter.hello()
    return `${greeting}, this is a worst example!`
  }
}

@Injectable()
class App {
  constructor(private welcomeMessage: WelcomeMessageGenerator) {}

  yieldWelcomeMessage() {
    console.log(this.welcomeMessage.getMessage())
  }
}

class Injector {
  static resolve<T>(target: ClassType<T>): T {
    const tokens = (
      Reflect.getMetadata('design:paramtypes', target) || []
    ).map((token) => this.resolve(token))

    return new target(...tokens)
  }
}

const app = Injector.resolve<App>(App)
app.yieldWelcomeMessage()

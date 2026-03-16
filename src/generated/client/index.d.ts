
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Article
 * 
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model ArticleScore
 * 
 */
export type ArticleScore = $Result.DefaultSelection<Prisma.$ArticleScorePayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model Book
 * 
 */
export type Book = $Result.DefaultSelection<Prisma.$BookPayload>
/**
 * Model WishlistItem
 * 
 */
export type WishlistItem = $Result.DefaultSelection<Prisma.$WishlistItemPayload>
/**
 * Model Song
 * 
 */
export type Song = $Result.DefaultSelection<Prisma.$SongPayload>
/**
 * Model Playlist
 * 
 */
export type Playlist = $Result.DefaultSelection<Prisma.$PlaylistPayload>
/**
 * Model PlaylistSong
 * 
 */
export type PlaylistSong = $Result.DefaultSelection<Prisma.$PlaylistSongPayload>
/**
 * Model MusicAccessLog
 * 
 */
export type MusicAccessLog = $Result.DefaultSelection<Prisma.$MusicAccessLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Articles
 * const articles = await prisma.article.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Articles
   * const articles = await prisma.article.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs>;

  /**
   * `prisma.articleScore`: Exposes CRUD operations for the **ArticleScore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleScores
    * const articleScores = await prisma.articleScore.findMany()
    * ```
    */
  get articleScore(): Prisma.ArticleScoreDelegate<ExtArgs>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs>;

  /**
   * `prisma.book`: Exposes CRUD operations for the **Book** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Books
    * const books = await prisma.book.findMany()
    * ```
    */
  get book(): Prisma.BookDelegate<ExtArgs>;

  /**
   * `prisma.wishlistItem`: Exposes CRUD operations for the **WishlistItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WishlistItems
    * const wishlistItems = await prisma.wishlistItem.findMany()
    * ```
    */
  get wishlistItem(): Prisma.WishlistItemDelegate<ExtArgs>;

  /**
   * `prisma.song`: Exposes CRUD operations for the **Song** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Songs
    * const songs = await prisma.song.findMany()
    * ```
    */
  get song(): Prisma.SongDelegate<ExtArgs>;

  /**
   * `prisma.playlist`: Exposes CRUD operations for the **Playlist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Playlists
    * const playlists = await prisma.playlist.findMany()
    * ```
    */
  get playlist(): Prisma.PlaylistDelegate<ExtArgs>;

  /**
   * `prisma.playlistSong`: Exposes CRUD operations for the **PlaylistSong** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlaylistSongs
    * const playlistSongs = await prisma.playlistSong.findMany()
    * ```
    */
  get playlistSong(): Prisma.PlaylistSongDelegate<ExtArgs>;

  /**
   * `prisma.musicAccessLog`: Exposes CRUD operations for the **MusicAccessLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MusicAccessLogs
    * const musicAccessLogs = await prisma.musicAccessLog.findMany()
    * ```
    */
  get musicAccessLog(): Prisma.MusicAccessLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Article: 'Article',
    Comment: 'Comment',
    ArticleScore: 'ArticleScore',
    Post: 'Post',
    Book: 'Book',
    WishlistItem: 'WishlistItem',
    Song: 'Song',
    Playlist: 'Playlist',
    PlaylistSong: 'PlaylistSong',
    MusicAccessLog: 'MusicAccessLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "article" | "comment" | "articleScore" | "post" | "book" | "wishlistItem" | "song" | "playlist" | "playlistSong" | "musicAccessLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      ArticleScore: {
        payload: Prisma.$ArticleScorePayload<ExtArgs>
        fields: Prisma.ArticleScoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleScoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleScoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>
          }
          findFirst: {
            args: Prisma.ArticleScoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleScoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>
          }
          findMany: {
            args: Prisma.ArticleScoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>[]
          }
          create: {
            args: Prisma.ArticleScoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>
          }
          createMany: {
            args: Prisma.ArticleScoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleScoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>[]
          }
          delete: {
            args: Prisma.ArticleScoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>
          }
          update: {
            args: Prisma.ArticleScoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>
          }
          deleteMany: {
            args: Prisma.ArticleScoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleScoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ArticleScoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleScorePayload>
          }
          aggregate: {
            args: Prisma.ArticleScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleScore>
          }
          groupBy: {
            args: Prisma.ArticleScoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleScoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleScoreCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleScoreCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      Book: {
        payload: Prisma.$BookPayload<ExtArgs>
        fields: Prisma.BookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          findFirst: {
            args: Prisma.BookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          findMany: {
            args: Prisma.BookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>[]
          }
          create: {
            args: Prisma.BookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          createMany: {
            args: Prisma.BookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>[]
          }
          delete: {
            args: Prisma.BookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          update: {
            args: Prisma.BookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          deleteMany: {
            args: Prisma.BookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPayload>
          }
          aggregate: {
            args: Prisma.BookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBook>
          }
          groupBy: {
            args: Prisma.BookGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookCountArgs<ExtArgs>
            result: $Utils.Optional<BookCountAggregateOutputType> | number
          }
        }
      }
      WishlistItem: {
        payload: Prisma.$WishlistItemPayload<ExtArgs>
        fields: Prisma.WishlistItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WishlistItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WishlistItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          findFirst: {
            args: Prisma.WishlistItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WishlistItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          findMany: {
            args: Prisma.WishlistItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          create: {
            args: Prisma.WishlistItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          createMany: {
            args: Prisma.WishlistItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WishlistItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          delete: {
            args: Prisma.WishlistItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          update: {
            args: Prisma.WishlistItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          deleteMany: {
            args: Prisma.WishlistItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WishlistItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WishlistItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          aggregate: {
            args: Prisma.WishlistItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWishlistItem>
          }
          groupBy: {
            args: Prisma.WishlistItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<WishlistItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.WishlistItemCountArgs<ExtArgs>
            result: $Utils.Optional<WishlistItemCountAggregateOutputType> | number
          }
        }
      }
      Song: {
        payload: Prisma.$SongPayload<ExtArgs>
        fields: Prisma.SongFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SongFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SongFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>
          }
          findFirst: {
            args: Prisma.SongFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SongFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>
          }
          findMany: {
            args: Prisma.SongFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>[]
          }
          create: {
            args: Prisma.SongCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>
          }
          createMany: {
            args: Prisma.SongCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SongCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>[]
          }
          delete: {
            args: Prisma.SongDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>
          }
          update: {
            args: Prisma.SongUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>
          }
          deleteMany: {
            args: Prisma.SongDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SongUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SongUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SongPayload>
          }
          aggregate: {
            args: Prisma.SongAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSong>
          }
          groupBy: {
            args: Prisma.SongGroupByArgs<ExtArgs>
            result: $Utils.Optional<SongGroupByOutputType>[]
          }
          count: {
            args: Prisma.SongCountArgs<ExtArgs>
            result: $Utils.Optional<SongCountAggregateOutputType> | number
          }
        }
      }
      Playlist: {
        payload: Prisma.$PlaylistPayload<ExtArgs>
        fields: Prisma.PlaylistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlaylistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlaylistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>
          }
          findFirst: {
            args: Prisma.PlaylistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlaylistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>
          }
          findMany: {
            args: Prisma.PlaylistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>[]
          }
          create: {
            args: Prisma.PlaylistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>
          }
          createMany: {
            args: Prisma.PlaylistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlaylistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>[]
          }
          delete: {
            args: Prisma.PlaylistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>
          }
          update: {
            args: Prisma.PlaylistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>
          }
          deleteMany: {
            args: Prisma.PlaylistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlaylistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlaylistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistPayload>
          }
          aggregate: {
            args: Prisma.PlaylistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlaylist>
          }
          groupBy: {
            args: Prisma.PlaylistGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlaylistGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlaylistCountArgs<ExtArgs>
            result: $Utils.Optional<PlaylistCountAggregateOutputType> | number
          }
        }
      }
      PlaylistSong: {
        payload: Prisma.$PlaylistSongPayload<ExtArgs>
        fields: Prisma.PlaylistSongFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlaylistSongFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlaylistSongFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>
          }
          findFirst: {
            args: Prisma.PlaylistSongFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlaylistSongFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>
          }
          findMany: {
            args: Prisma.PlaylistSongFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>[]
          }
          create: {
            args: Prisma.PlaylistSongCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>
          }
          createMany: {
            args: Prisma.PlaylistSongCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlaylistSongCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>[]
          }
          delete: {
            args: Prisma.PlaylistSongDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>
          }
          update: {
            args: Prisma.PlaylistSongUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>
          }
          deleteMany: {
            args: Prisma.PlaylistSongDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlaylistSongUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlaylistSongUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlaylistSongPayload>
          }
          aggregate: {
            args: Prisma.PlaylistSongAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlaylistSong>
          }
          groupBy: {
            args: Prisma.PlaylistSongGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlaylistSongGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlaylistSongCountArgs<ExtArgs>
            result: $Utils.Optional<PlaylistSongCountAggregateOutputType> | number
          }
        }
      }
      MusicAccessLog: {
        payload: Prisma.$MusicAccessLogPayload<ExtArgs>
        fields: Prisma.MusicAccessLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MusicAccessLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MusicAccessLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>
          }
          findFirst: {
            args: Prisma.MusicAccessLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MusicAccessLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>
          }
          findMany: {
            args: Prisma.MusicAccessLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>[]
          }
          create: {
            args: Prisma.MusicAccessLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>
          }
          createMany: {
            args: Prisma.MusicAccessLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MusicAccessLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>[]
          }
          delete: {
            args: Prisma.MusicAccessLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>
          }
          update: {
            args: Prisma.MusicAccessLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>
          }
          deleteMany: {
            args: Prisma.MusicAccessLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MusicAccessLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MusicAccessLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicAccessLogPayload>
          }
          aggregate: {
            args: Prisma.MusicAccessLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMusicAccessLog>
          }
          groupBy: {
            args: Prisma.MusicAccessLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<MusicAccessLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.MusicAccessLogCountArgs<ExtArgs>
            result: $Utils.Optional<MusicAccessLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SongCountOutputType
   */

  export type SongCountOutputType = {
    playlists: number
  }

  export type SongCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    playlists?: boolean | SongCountOutputTypeCountPlaylistsArgs
  }

  // Custom InputTypes
  /**
   * SongCountOutputType without action
   */
  export type SongCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SongCountOutputType
     */
    select?: SongCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SongCountOutputType without action
   */
  export type SongCountOutputTypeCountPlaylistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaylistSongWhereInput
  }


  /**
   * Count Type PlaylistCountOutputType
   */

  export type PlaylistCountOutputType = {
    songs: number
  }

  export type PlaylistCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    songs?: boolean | PlaylistCountOutputTypeCountSongsArgs
  }

  // Custom InputTypes
  /**
   * PlaylistCountOutputType without action
   */
  export type PlaylistCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistCountOutputType
     */
    select?: PlaylistCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlaylistCountOutputType without action
   */
  export type PlaylistCountOutputTypeCountSongsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaylistSongWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isRead: boolean | null
    scheduledFor: Date | null
    imageUrl: string | null
    url: string | null
    category: string | null
    isBookmarked: boolean | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isRead: boolean | null
    scheduledFor: Date | null
    imageUrl: string | null
    url: string | null
    category: string | null
    isBookmarked: boolean | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    createdAt: number
    updatedAt: number
    isRead: number
    scheduledFor: number
    imageUrl: number
    url: number
    category: number
    isBookmarked: number
    _all: number
  }


  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    isRead?: true
    scheduledFor?: true
    imageUrl?: true
    url?: true
    category?: true
    isBookmarked?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    isRead?: true
    scheduledFor?: true
    imageUrl?: true
    url?: true
    category?: true
    isBookmarked?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    isRead?: true
    scheduledFor?: true
    imageUrl?: true
    url?: true
    category?: true
    isBookmarked?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
    isRead: boolean
    scheduledFor: Date | null
    imageUrl: string | null
    url: string | null
    category: string | null
    isBookmarked: boolean
    _count: ArticleCountAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isRead?: boolean
    scheduledFor?: boolean
    imageUrl?: boolean
    url?: boolean
    category?: boolean
    isBookmarked?: boolean
    score?: boolean | Article$scoreArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isRead?: boolean
    scheduledFor?: boolean
    imageUrl?: boolean
    url?: boolean
    category?: boolean
    isBookmarked?: boolean
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isRead?: boolean
    scheduledFor?: boolean
    imageUrl?: boolean
    url?: boolean
    category?: boolean
    isBookmarked?: boolean
  }

  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    score?: boolean | Article$scoreArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      score: Prisma.$ArticleScorePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      createdAt: Date
      updatedAt: Date
      isRead: boolean
      scheduledFor: Date | null
      imageUrl: string | null
      url: string | null
      category: string | null
      isBookmarked: boolean
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    score<T extends Article$scoreArgs<ExtArgs> = {}>(args?: Subset<T, Article$scoreArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */ 
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'String'>
    readonly title: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly createdAt: FieldRef<"Article", 'DateTime'>
    readonly updatedAt: FieldRef<"Article", 'DateTime'>
    readonly isRead: FieldRef<"Article", 'Boolean'>
    readonly scheduledFor: FieldRef<"Article", 'DateTime'>
    readonly imageUrl: FieldRef<"Article", 'String'>
    readonly url: FieldRef<"Article", 'String'>
    readonly category: FieldRef<"Article", 'String'>
    readonly isBookmarked: FieldRef<"Article", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
  }

  /**
   * Article.score
   */
  export type Article$scoreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    where?: ArticleScoreWhereInput
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    authorName: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    authorName: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    articleId: number
    authorName: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    articleId?: true
    authorName?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    articleId?: true
    authorName?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    articleId?: true
    authorName?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    articleId: string
    authorName: string
    content: string
    createdAt: Date
    updatedAt: Date
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    authorName?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    authorName?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    articleId?: boolean
    authorName?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      authorName: string
      content: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */ 
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly articleId: FieldRef<"Comment", 'String'>
    readonly authorName: FieldRef<"Comment", 'String'>
    readonly content: FieldRef<"Comment", 'String'>
    readonly createdAt: FieldRef<"Comment", 'DateTime'>
    readonly updatedAt: FieldRef<"Comment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
  }


  /**
   * Model ArticleScore
   */

  export type AggregateArticleScore = {
    _count: ArticleScoreCountAggregateOutputType | null
    _avg: ArticleScoreAvgAggregateOutputType | null
    _sum: ArticleScoreSumAggregateOutputType | null
    _min: ArticleScoreMinAggregateOutputType | null
    _max: ArticleScoreMaxAggregateOutputType | null
  }

  export type ArticleScoreAvgAggregateOutputType = {
    substance: number | null
    depth: number | null
    structure: number | null
    vocabulary: number | null
    readability: number | null
    specificity: number | null
    actionability: number | null
    engagement: number | null
    total: number | null
    socialScore: number | null
  }

  export type ArticleScoreSumAggregateOutputType = {
    substance: number | null
    depth: number | null
    structure: number | null
    vocabulary: number | null
    readability: number | null
    specificity: number | null
    actionability: number | null
    engagement: number | null
    total: number | null
    socialScore: number | null
  }

  export type ArticleScoreMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    substance: number | null
    depth: number | null
    structure: number | null
    vocabulary: number | null
    readability: number | null
    specificity: number | null
    actionability: number | null
    engagement: number | null
    total: number | null
    updatedAt: Date | null
    socialScore: number | null
  }

  export type ArticleScoreMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    substance: number | null
    depth: number | null
    structure: number | null
    vocabulary: number | null
    readability: number | null
    specificity: number | null
    actionability: number | null
    engagement: number | null
    total: number | null
    updatedAt: Date | null
    socialScore: number | null
  }

  export type ArticleScoreCountAggregateOutputType = {
    id: number
    articleId: number
    substance: number
    depth: number
    structure: number
    vocabulary: number
    readability: number
    specificity: number
    actionability: number
    engagement: number
    total: number
    updatedAt: number
    socialScore: number
    _all: number
  }


  export type ArticleScoreAvgAggregateInputType = {
    substance?: true
    depth?: true
    structure?: true
    vocabulary?: true
    readability?: true
    specificity?: true
    actionability?: true
    engagement?: true
    total?: true
    socialScore?: true
  }

  export type ArticleScoreSumAggregateInputType = {
    substance?: true
    depth?: true
    structure?: true
    vocabulary?: true
    readability?: true
    specificity?: true
    actionability?: true
    engagement?: true
    total?: true
    socialScore?: true
  }

  export type ArticleScoreMinAggregateInputType = {
    id?: true
    articleId?: true
    substance?: true
    depth?: true
    structure?: true
    vocabulary?: true
    readability?: true
    specificity?: true
    actionability?: true
    engagement?: true
    total?: true
    updatedAt?: true
    socialScore?: true
  }

  export type ArticleScoreMaxAggregateInputType = {
    id?: true
    articleId?: true
    substance?: true
    depth?: true
    structure?: true
    vocabulary?: true
    readability?: true
    specificity?: true
    actionability?: true
    engagement?: true
    total?: true
    updatedAt?: true
    socialScore?: true
  }

  export type ArticleScoreCountAggregateInputType = {
    id?: true
    articleId?: true
    substance?: true
    depth?: true
    structure?: true
    vocabulary?: true
    readability?: true
    specificity?: true
    actionability?: true
    engagement?: true
    total?: true
    updatedAt?: true
    socialScore?: true
    _all?: true
  }

  export type ArticleScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleScore to aggregate.
     */
    where?: ArticleScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleScores to fetch.
     */
    orderBy?: ArticleScoreOrderByWithRelationInput | ArticleScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleScores
    **/
    _count?: true | ArticleScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleScoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleScoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleScoreMaxAggregateInputType
  }

  export type GetArticleScoreAggregateType<T extends ArticleScoreAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleScore[P]>
      : GetScalarType<T[P], AggregateArticleScore[P]>
  }




  export type ArticleScoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleScoreWhereInput
    orderBy?: ArticleScoreOrderByWithAggregationInput | ArticleScoreOrderByWithAggregationInput[]
    by: ArticleScoreScalarFieldEnum[] | ArticleScoreScalarFieldEnum
    having?: ArticleScoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleScoreCountAggregateInputType | true
    _avg?: ArticleScoreAvgAggregateInputType
    _sum?: ArticleScoreSumAggregateInputType
    _min?: ArticleScoreMinAggregateInputType
    _max?: ArticleScoreMaxAggregateInputType
  }

  export type ArticleScoreGroupByOutputType = {
    id: string
    articleId: string
    substance: number
    depth: number
    structure: number
    vocabulary: number
    readability: number
    specificity: number
    actionability: number
    engagement: number
    total: number
    updatedAt: Date
    socialScore: number
    _count: ArticleScoreCountAggregateOutputType | null
    _avg: ArticleScoreAvgAggregateOutputType | null
    _sum: ArticleScoreSumAggregateOutputType | null
    _min: ArticleScoreMinAggregateOutputType | null
    _max: ArticleScoreMaxAggregateOutputType | null
  }

  type GetArticleScoreGroupByPayload<T extends ArticleScoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleScoreGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleScoreGroupByOutputType[P]>
        }
      >
    >


  export type ArticleScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    substance?: boolean
    depth?: boolean
    structure?: boolean
    vocabulary?: boolean
    readability?: boolean
    specificity?: boolean
    actionability?: boolean
    engagement?: boolean
    total?: boolean
    updatedAt?: boolean
    socialScore?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleScore"]>

  export type ArticleScoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    substance?: boolean
    depth?: boolean
    structure?: boolean
    vocabulary?: boolean
    readability?: boolean
    specificity?: boolean
    actionability?: boolean
    engagement?: boolean
    total?: boolean
    updatedAt?: boolean
    socialScore?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleScore"]>

  export type ArticleScoreSelectScalar = {
    id?: boolean
    articleId?: boolean
    substance?: boolean
    depth?: boolean
    structure?: boolean
    vocabulary?: boolean
    readability?: boolean
    specificity?: boolean
    actionability?: boolean
    engagement?: boolean
    total?: boolean
    updatedAt?: boolean
    socialScore?: boolean
  }

  export type ArticleScoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleScoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $ArticleScorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleScore"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      substance: number
      depth: number
      structure: number
      vocabulary: number
      readability: number
      specificity: number
      actionability: number
      engagement: number
      total: number
      updatedAt: Date
      socialScore: number
    }, ExtArgs["result"]["articleScore"]>
    composites: {}
  }

  type ArticleScoreGetPayload<S extends boolean | null | undefined | ArticleScoreDefaultArgs> = $Result.GetResult<Prisma.$ArticleScorePayload, S>

  type ArticleScoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ArticleScoreFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ArticleScoreCountAggregateInputType | true
    }

  export interface ArticleScoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleScore'], meta: { name: 'ArticleScore' } }
    /**
     * Find zero or one ArticleScore that matches the filter.
     * @param {ArticleScoreFindUniqueArgs} args - Arguments to find a ArticleScore
     * @example
     * // Get one ArticleScore
     * const articleScore = await prisma.articleScore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleScoreFindUniqueArgs>(args: SelectSubset<T, ArticleScoreFindUniqueArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ArticleScore that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ArticleScoreFindUniqueOrThrowArgs} args - Arguments to find a ArticleScore
     * @example
     * // Get one ArticleScore
     * const articleScore = await prisma.articleScore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleScoreFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ArticleScore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreFindFirstArgs} args - Arguments to find a ArticleScore
     * @example
     * // Get one ArticleScore
     * const articleScore = await prisma.articleScore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleScoreFindFirstArgs>(args?: SelectSubset<T, ArticleScoreFindFirstArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ArticleScore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreFindFirstOrThrowArgs} args - Arguments to find a ArticleScore
     * @example
     * // Get one ArticleScore
     * const articleScore = await prisma.articleScore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleScoreFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ArticleScores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleScores
     * const articleScores = await prisma.articleScore.findMany()
     * 
     * // Get first 10 ArticleScores
     * const articleScores = await prisma.articleScore.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleScoreWithIdOnly = await prisma.articleScore.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleScoreFindManyArgs>(args?: SelectSubset<T, ArticleScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ArticleScore.
     * @param {ArticleScoreCreateArgs} args - Arguments to create a ArticleScore.
     * @example
     * // Create one ArticleScore
     * const ArticleScore = await prisma.articleScore.create({
     *   data: {
     *     // ... data to create a ArticleScore
     *   }
     * })
     * 
     */
    create<T extends ArticleScoreCreateArgs>(args: SelectSubset<T, ArticleScoreCreateArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ArticleScores.
     * @param {ArticleScoreCreateManyArgs} args - Arguments to create many ArticleScores.
     * @example
     * // Create many ArticleScores
     * const articleScore = await prisma.articleScore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleScoreCreateManyArgs>(args?: SelectSubset<T, ArticleScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleScores and returns the data saved in the database.
     * @param {ArticleScoreCreateManyAndReturnArgs} args - Arguments to create many ArticleScores.
     * @example
     * // Create many ArticleScores
     * const articleScore = await prisma.articleScore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleScores and only return the `id`
     * const articleScoreWithIdOnly = await prisma.articleScore.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleScoreCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleScoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ArticleScore.
     * @param {ArticleScoreDeleteArgs} args - Arguments to delete one ArticleScore.
     * @example
     * // Delete one ArticleScore
     * const ArticleScore = await prisma.articleScore.delete({
     *   where: {
     *     // ... filter to delete one ArticleScore
     *   }
     * })
     * 
     */
    delete<T extends ArticleScoreDeleteArgs>(args: SelectSubset<T, ArticleScoreDeleteArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ArticleScore.
     * @param {ArticleScoreUpdateArgs} args - Arguments to update one ArticleScore.
     * @example
     * // Update one ArticleScore
     * const articleScore = await prisma.articleScore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleScoreUpdateArgs>(args: SelectSubset<T, ArticleScoreUpdateArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ArticleScores.
     * @param {ArticleScoreDeleteManyArgs} args - Arguments to filter ArticleScores to delete.
     * @example
     * // Delete a few ArticleScores
     * const { count } = await prisma.articleScore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleScoreDeleteManyArgs>(args?: SelectSubset<T, ArticleScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleScores
     * const articleScore = await prisma.articleScore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleScoreUpdateManyArgs>(args: SelectSubset<T, ArticleScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ArticleScore.
     * @param {ArticleScoreUpsertArgs} args - Arguments to update or create a ArticleScore.
     * @example
     * // Update or create a ArticleScore
     * const articleScore = await prisma.articleScore.upsert({
     *   create: {
     *     // ... data to create a ArticleScore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleScore we want to update
     *   }
     * })
     */
    upsert<T extends ArticleScoreUpsertArgs>(args: SelectSubset<T, ArticleScoreUpsertArgs<ExtArgs>>): Prisma__ArticleScoreClient<$Result.GetResult<Prisma.$ArticleScorePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ArticleScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreCountArgs} args - Arguments to filter ArticleScores to count.
     * @example
     * // Count the number of ArticleScores
     * const count = await prisma.articleScore.count({
     *   where: {
     *     // ... the filter for the ArticleScores we want to count
     *   }
     * })
    **/
    count<T extends ArticleScoreCountArgs>(
      args?: Subset<T, ArticleScoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleScoreAggregateArgs>(args: Subset<T, ArticleScoreAggregateArgs>): Prisma.PrismaPromise<GetArticleScoreAggregateType<T>>

    /**
     * Group by ArticleScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleScoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleScoreGroupByArgs['orderBy'] }
        : { orderBy?: ArticleScoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleScore model
   */
  readonly fields: ArticleScoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleScore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleScoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleScore model
   */ 
  interface ArticleScoreFieldRefs {
    readonly id: FieldRef<"ArticleScore", 'String'>
    readonly articleId: FieldRef<"ArticleScore", 'String'>
    readonly substance: FieldRef<"ArticleScore", 'Int'>
    readonly depth: FieldRef<"ArticleScore", 'Int'>
    readonly structure: FieldRef<"ArticleScore", 'Int'>
    readonly vocabulary: FieldRef<"ArticleScore", 'Int'>
    readonly readability: FieldRef<"ArticleScore", 'Int'>
    readonly specificity: FieldRef<"ArticleScore", 'Int'>
    readonly actionability: FieldRef<"ArticleScore", 'Int'>
    readonly engagement: FieldRef<"ArticleScore", 'Int'>
    readonly total: FieldRef<"ArticleScore", 'Int'>
    readonly updatedAt: FieldRef<"ArticleScore", 'DateTime'>
    readonly socialScore: FieldRef<"ArticleScore", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ArticleScore findUnique
   */
  export type ArticleScoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * Filter, which ArticleScore to fetch.
     */
    where: ArticleScoreWhereUniqueInput
  }

  /**
   * ArticleScore findUniqueOrThrow
   */
  export type ArticleScoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * Filter, which ArticleScore to fetch.
     */
    where: ArticleScoreWhereUniqueInput
  }

  /**
   * ArticleScore findFirst
   */
  export type ArticleScoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * Filter, which ArticleScore to fetch.
     */
    where?: ArticleScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleScores to fetch.
     */
    orderBy?: ArticleScoreOrderByWithRelationInput | ArticleScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleScores.
     */
    cursor?: ArticleScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleScores.
     */
    distinct?: ArticleScoreScalarFieldEnum | ArticleScoreScalarFieldEnum[]
  }

  /**
   * ArticleScore findFirstOrThrow
   */
  export type ArticleScoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * Filter, which ArticleScore to fetch.
     */
    where?: ArticleScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleScores to fetch.
     */
    orderBy?: ArticleScoreOrderByWithRelationInput | ArticleScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleScores.
     */
    cursor?: ArticleScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleScores.
     */
    distinct?: ArticleScoreScalarFieldEnum | ArticleScoreScalarFieldEnum[]
  }

  /**
   * ArticleScore findMany
   */
  export type ArticleScoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * Filter, which ArticleScores to fetch.
     */
    where?: ArticleScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleScores to fetch.
     */
    orderBy?: ArticleScoreOrderByWithRelationInput | ArticleScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleScores.
     */
    cursor?: ArticleScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleScores.
     */
    skip?: number
    distinct?: ArticleScoreScalarFieldEnum | ArticleScoreScalarFieldEnum[]
  }

  /**
   * ArticleScore create
   */
  export type ArticleScoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleScore.
     */
    data: XOR<ArticleScoreCreateInput, ArticleScoreUncheckedCreateInput>
  }

  /**
   * ArticleScore createMany
   */
  export type ArticleScoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleScores.
     */
    data: ArticleScoreCreateManyInput | ArticleScoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ArticleScore createManyAndReturn
   */
  export type ArticleScoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ArticleScores.
     */
    data: ArticleScoreCreateManyInput | ArticleScoreCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleScore update
   */
  export type ArticleScoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleScore.
     */
    data: XOR<ArticleScoreUpdateInput, ArticleScoreUncheckedUpdateInput>
    /**
     * Choose, which ArticleScore to update.
     */
    where: ArticleScoreWhereUniqueInput
  }

  /**
   * ArticleScore updateMany
   */
  export type ArticleScoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleScores.
     */
    data: XOR<ArticleScoreUpdateManyMutationInput, ArticleScoreUncheckedUpdateManyInput>
    /**
     * Filter which ArticleScores to update
     */
    where?: ArticleScoreWhereInput
  }

  /**
   * ArticleScore upsert
   */
  export type ArticleScoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleScore to update in case it exists.
     */
    where: ArticleScoreWhereUniqueInput
    /**
     * In case the ArticleScore found by the `where` argument doesn't exist, create a new ArticleScore with this data.
     */
    create: XOR<ArticleScoreCreateInput, ArticleScoreUncheckedCreateInput>
    /**
     * In case the ArticleScore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleScoreUpdateInput, ArticleScoreUncheckedUpdateInput>
  }

  /**
   * ArticleScore delete
   */
  export type ArticleScoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
    /**
     * Filter which ArticleScore to delete.
     */
    where: ArticleScoreWhereUniqueInput
  }

  /**
   * ArticleScore deleteMany
   */
  export type ArticleScoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleScores to delete
     */
    where?: ArticleScoreWhereInput
  }

  /**
   * ArticleScore without action
   */
  export type ArticleScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleScore
     */
    select?: ArticleScoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleScoreInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostMinAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    content: string | null
    published: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    imageUrl: string | null
    url: string | null
  }

  export type PostMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    content: string | null
    published: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    imageUrl: string | null
    url: string | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    slug: number
    title: number
    content: number
    published: number
    createdAt: number
    updatedAt: number
    imageUrl: number
    url: number
    _all: number
  }


  export type PostMinAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    content?: true
    published?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    url?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    content?: true
    published?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    url?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    content?: true
    published?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    url?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: string
    slug: string
    title: string
    content: string
    published: boolean
    createdAt: Date
    updatedAt: Date
    imageUrl: string | null
    url: string | null
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
    url?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
    url?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    slug?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
    url?: boolean
  }


  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      title: string
      content: string
      published: boolean
      createdAt: Date
      updatedAt: Date
      imageUrl: string | null
      url: string | null
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */ 
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'String'>
    readonly slug: FieldRef<"Post", 'String'>
    readonly title: FieldRef<"Post", 'String'>
    readonly content: FieldRef<"Post", 'String'>
    readonly published: FieldRef<"Post", 'Boolean'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
    readonly imageUrl: FieldRef<"Post", 'String'>
    readonly url: FieldRef<"Post", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
  }


  /**
   * Model Book
   */

  export type AggregateBook = {
    _count: BookCountAggregateOutputType | null
    _avg: BookAvgAggregateOutputType | null
    _sum: BookSumAggregateOutputType | null
    _min: BookMinAggregateOutputType | null
    _max: BookMaxAggregateOutputType | null
  }

  export type BookAvgAggregateOutputType = {
    rating: number | null
  }

  export type BookSumAggregateOutputType = {
    rating: number | null
  }

  export type BookMinAggregateOutputType = {
    id: string | null
    title: string | null
    author: string | null
    review: string | null
    rating: number | null
    createdAt: Date | null
    updatedAt: Date | null
    imageUrl: string | null
    url: string | null
  }

  export type BookMaxAggregateOutputType = {
    id: string | null
    title: string | null
    author: string | null
    review: string | null
    rating: number | null
    createdAt: Date | null
    updatedAt: Date | null
    imageUrl: string | null
    url: string | null
  }

  export type BookCountAggregateOutputType = {
    id: number
    title: number
    author: number
    review: number
    rating: number
    createdAt: number
    updatedAt: number
    imageUrl: number
    url: number
    _all: number
  }


  export type BookAvgAggregateInputType = {
    rating?: true
  }

  export type BookSumAggregateInputType = {
    rating?: true
  }

  export type BookMinAggregateInputType = {
    id?: true
    title?: true
    author?: true
    review?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    url?: true
  }

  export type BookMaxAggregateInputType = {
    id?: true
    title?: true
    author?: true
    review?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    url?: true
  }

  export type BookCountAggregateInputType = {
    id?: true
    title?: true
    author?: true
    review?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    url?: true
    _all?: true
  }

  export type BookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Book to aggregate.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Books
    **/
    _count?: true | BookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookMaxAggregateInputType
  }

  export type GetBookAggregateType<T extends BookAggregateArgs> = {
        [P in keyof T & keyof AggregateBook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBook[P]>
      : GetScalarType<T[P], AggregateBook[P]>
  }




  export type BookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookWhereInput
    orderBy?: BookOrderByWithAggregationInput | BookOrderByWithAggregationInput[]
    by: BookScalarFieldEnum[] | BookScalarFieldEnum
    having?: BookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookCountAggregateInputType | true
    _avg?: BookAvgAggregateInputType
    _sum?: BookSumAggregateInputType
    _min?: BookMinAggregateInputType
    _max?: BookMaxAggregateInputType
  }

  export type BookGroupByOutputType = {
    id: string
    title: string
    author: string
    review: string | null
    rating: number
    createdAt: Date
    updatedAt: Date
    imageUrl: string | null
    url: string | null
    _count: BookCountAggregateOutputType | null
    _avg: BookAvgAggregateOutputType | null
    _sum: BookSumAggregateOutputType | null
    _min: BookMinAggregateOutputType | null
    _max: BookMaxAggregateOutputType | null
  }

  type GetBookGroupByPayload<T extends BookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookGroupByOutputType[P]>
            : GetScalarType<T[P], BookGroupByOutputType[P]>
        }
      >
    >


  export type BookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    author?: boolean
    review?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
    url?: boolean
  }, ExtArgs["result"]["book"]>

  export type BookSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    author?: boolean
    review?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
    url?: boolean
  }, ExtArgs["result"]["book"]>

  export type BookSelectScalar = {
    id?: boolean
    title?: boolean
    author?: boolean
    review?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
    url?: boolean
  }


  export type $BookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Book"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      author: string
      review: string | null
      rating: number
      createdAt: Date
      updatedAt: Date
      imageUrl: string | null
      url: string | null
    }, ExtArgs["result"]["book"]>
    composites: {}
  }

  type BookGetPayload<S extends boolean | null | undefined | BookDefaultArgs> = $Result.GetResult<Prisma.$BookPayload, S>

  type BookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookCountAggregateInputType | true
    }

  export interface BookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Book'], meta: { name: 'Book' } }
    /**
     * Find zero or one Book that matches the filter.
     * @param {BookFindUniqueArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookFindUniqueArgs>(args: SelectSubset<T, BookFindUniqueArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Book that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookFindUniqueOrThrowArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookFindUniqueOrThrowArgs>(args: SelectSubset<T, BookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Book that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookFindFirstArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookFindFirstArgs>(args?: SelectSubset<T, BookFindFirstArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Book that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookFindFirstOrThrowArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookFindFirstOrThrowArgs>(args?: SelectSubset<T, BookFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Books
     * const books = await prisma.book.findMany()
     * 
     * // Get first 10 Books
     * const books = await prisma.book.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookWithIdOnly = await prisma.book.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookFindManyArgs>(args?: SelectSubset<T, BookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Book.
     * @param {BookCreateArgs} args - Arguments to create a Book.
     * @example
     * // Create one Book
     * const Book = await prisma.book.create({
     *   data: {
     *     // ... data to create a Book
     *   }
     * })
     * 
     */
    create<T extends BookCreateArgs>(args: SelectSubset<T, BookCreateArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Books.
     * @param {BookCreateManyArgs} args - Arguments to create many Books.
     * @example
     * // Create many Books
     * const book = await prisma.book.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookCreateManyArgs>(args?: SelectSubset<T, BookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Books and returns the data saved in the database.
     * @param {BookCreateManyAndReturnArgs} args - Arguments to create many Books.
     * @example
     * // Create many Books
     * const book = await prisma.book.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Books and only return the `id`
     * const bookWithIdOnly = await prisma.book.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookCreateManyAndReturnArgs>(args?: SelectSubset<T, BookCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Book.
     * @param {BookDeleteArgs} args - Arguments to delete one Book.
     * @example
     * // Delete one Book
     * const Book = await prisma.book.delete({
     *   where: {
     *     // ... filter to delete one Book
     *   }
     * })
     * 
     */
    delete<T extends BookDeleteArgs>(args: SelectSubset<T, BookDeleteArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Book.
     * @param {BookUpdateArgs} args - Arguments to update one Book.
     * @example
     * // Update one Book
     * const book = await prisma.book.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookUpdateArgs>(args: SelectSubset<T, BookUpdateArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Books.
     * @param {BookDeleteManyArgs} args - Arguments to filter Books to delete.
     * @example
     * // Delete a few Books
     * const { count } = await prisma.book.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookDeleteManyArgs>(args?: SelectSubset<T, BookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Books
     * const book = await prisma.book.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookUpdateManyArgs>(args: SelectSubset<T, BookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Book.
     * @param {BookUpsertArgs} args - Arguments to update or create a Book.
     * @example
     * // Update or create a Book
     * const book = await prisma.book.upsert({
     *   create: {
     *     // ... data to create a Book
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Book we want to update
     *   }
     * })
     */
    upsert<T extends BookUpsertArgs>(args: SelectSubset<T, BookUpsertArgs<ExtArgs>>): Prisma__BookClient<$Result.GetResult<Prisma.$BookPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookCountArgs} args - Arguments to filter Books to count.
     * @example
     * // Count the number of Books
     * const count = await prisma.book.count({
     *   where: {
     *     // ... the filter for the Books we want to count
     *   }
     * })
    **/
    count<T extends BookCountArgs>(
      args?: Subset<T, BookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Book.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookAggregateArgs>(args: Subset<T, BookAggregateArgs>): Prisma.PrismaPromise<GetBookAggregateType<T>>

    /**
     * Group by Book.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookGroupByArgs['orderBy'] }
        : { orderBy?: BookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Book model
   */
  readonly fields: BookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Book.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Book model
   */ 
  interface BookFieldRefs {
    readonly id: FieldRef<"Book", 'String'>
    readonly title: FieldRef<"Book", 'String'>
    readonly author: FieldRef<"Book", 'String'>
    readonly review: FieldRef<"Book", 'String'>
    readonly rating: FieldRef<"Book", 'Int'>
    readonly createdAt: FieldRef<"Book", 'DateTime'>
    readonly updatedAt: FieldRef<"Book", 'DateTime'>
    readonly imageUrl: FieldRef<"Book", 'String'>
    readonly url: FieldRef<"Book", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Book findUnique
   */
  export type BookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book findUniqueOrThrow
   */
  export type BookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book findFirst
   */
  export type BookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Books.
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Books.
     */
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Book findFirstOrThrow
   */
  export type BookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Filter, which Book to fetch.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Books.
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Books.
     */
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Book findMany
   */
  export type BookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Filter, which Books to fetch.
     */
    where?: BookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Books to fetch.
     */
    orderBy?: BookOrderByWithRelationInput | BookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Books.
     */
    cursor?: BookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Books.
     */
    skip?: number
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * Book create
   */
  export type BookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * The data needed to create a Book.
     */
    data: XOR<BookCreateInput, BookUncheckedCreateInput>
  }

  /**
   * Book createMany
   */
  export type BookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Books.
     */
    data: BookCreateManyInput | BookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Book createManyAndReturn
   */
  export type BookCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Books.
     */
    data: BookCreateManyInput | BookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Book update
   */
  export type BookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * The data needed to update a Book.
     */
    data: XOR<BookUpdateInput, BookUncheckedUpdateInput>
    /**
     * Choose, which Book to update.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book updateMany
   */
  export type BookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Books.
     */
    data: XOR<BookUpdateManyMutationInput, BookUncheckedUpdateManyInput>
    /**
     * Filter which Books to update
     */
    where?: BookWhereInput
  }

  /**
   * Book upsert
   */
  export type BookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * The filter to search for the Book to update in case it exists.
     */
    where: BookWhereUniqueInput
    /**
     * In case the Book found by the `where` argument doesn't exist, create a new Book with this data.
     */
    create: XOR<BookCreateInput, BookUncheckedCreateInput>
    /**
     * In case the Book was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookUpdateInput, BookUncheckedUpdateInput>
  }

  /**
   * Book delete
   */
  export type BookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
    /**
     * Filter which Book to delete.
     */
    where: BookWhereUniqueInput
  }

  /**
   * Book deleteMany
   */
  export type BookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Books to delete
     */
    where?: BookWhereInput
  }

  /**
   * Book without action
   */
  export type BookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Book
     */
    select?: BookSelect<ExtArgs> | null
  }


  /**
   * Model WishlistItem
   */

  export type AggregateWishlistItem = {
    _count: WishlistItemCountAggregateOutputType | null
    _min: WishlistItemMinAggregateOutputType | null
    _max: WishlistItemMaxAggregateOutputType | null
  }

  export type WishlistItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    price: string | null
    url: string | null
    priority: string | null
    createdAt: Date | null
    updatedAt: Date | null
    imageUrl: string | null
  }

  export type WishlistItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    price: string | null
    url: string | null
    priority: string | null
    createdAt: Date | null
    updatedAt: Date | null
    imageUrl: string | null
  }

  export type WishlistItemCountAggregateOutputType = {
    id: number
    name: number
    price: number
    url: number
    priority: number
    createdAt: number
    updatedAt: number
    imageUrl: number
    _all: number
  }


  export type WishlistItemMinAggregateInputType = {
    id?: true
    name?: true
    price?: true
    url?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
  }

  export type WishlistItemMaxAggregateInputType = {
    id?: true
    name?: true
    price?: true
    url?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
  }

  export type WishlistItemCountAggregateInputType = {
    id?: true
    name?: true
    price?: true
    url?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    imageUrl?: true
    _all?: true
  }

  export type WishlistItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WishlistItem to aggregate.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WishlistItems
    **/
    _count?: true | WishlistItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WishlistItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WishlistItemMaxAggregateInputType
  }

  export type GetWishlistItemAggregateType<T extends WishlistItemAggregateArgs> = {
        [P in keyof T & keyof AggregateWishlistItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWishlistItem[P]>
      : GetScalarType<T[P], AggregateWishlistItem[P]>
  }




  export type WishlistItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistItemWhereInput
    orderBy?: WishlistItemOrderByWithAggregationInput | WishlistItemOrderByWithAggregationInput[]
    by: WishlistItemScalarFieldEnum[] | WishlistItemScalarFieldEnum
    having?: WishlistItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WishlistItemCountAggregateInputType | true
    _min?: WishlistItemMinAggregateInputType
    _max?: WishlistItemMaxAggregateInputType
  }

  export type WishlistItemGroupByOutputType = {
    id: string
    name: string
    price: string | null
    url: string | null
    priority: string
    createdAt: Date
    updatedAt: Date
    imageUrl: string | null
    _count: WishlistItemCountAggregateOutputType | null
    _min: WishlistItemMinAggregateOutputType | null
    _max: WishlistItemMaxAggregateOutputType | null
  }

  type GetWishlistItemGroupByPayload<T extends WishlistItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WishlistItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WishlistItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
            : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
        }
      >
    >


  export type WishlistItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    url?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    url?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectScalar = {
    id?: boolean
    name?: boolean
    price?: boolean
    url?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    imageUrl?: boolean
  }


  export type $WishlistItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WishlistItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      price: string | null
      url: string | null
      priority: string
      createdAt: Date
      updatedAt: Date
      imageUrl: string | null
    }, ExtArgs["result"]["wishlistItem"]>
    composites: {}
  }

  type WishlistItemGetPayload<S extends boolean | null | undefined | WishlistItemDefaultArgs> = $Result.GetResult<Prisma.$WishlistItemPayload, S>

  type WishlistItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WishlistItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WishlistItemCountAggregateInputType | true
    }

  export interface WishlistItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WishlistItem'], meta: { name: 'WishlistItem' } }
    /**
     * Find zero or one WishlistItem that matches the filter.
     * @param {WishlistItemFindUniqueArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WishlistItemFindUniqueArgs>(args: SelectSubset<T, WishlistItemFindUniqueArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WishlistItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WishlistItemFindUniqueOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WishlistItemFindUniqueOrThrowArgs>(args: SelectSubset<T, WishlistItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WishlistItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WishlistItemFindFirstArgs>(args?: SelectSubset<T, WishlistItemFindFirstArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WishlistItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WishlistItemFindFirstOrThrowArgs>(args?: SelectSubset<T, WishlistItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WishlistItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany()
     * 
     * // Get first 10 WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WishlistItemFindManyArgs>(args?: SelectSubset<T, WishlistItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WishlistItem.
     * @param {WishlistItemCreateArgs} args - Arguments to create a WishlistItem.
     * @example
     * // Create one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.create({
     *   data: {
     *     // ... data to create a WishlistItem
     *   }
     * })
     * 
     */
    create<T extends WishlistItemCreateArgs>(args: SelectSubset<T, WishlistItemCreateArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WishlistItems.
     * @param {WishlistItemCreateManyArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WishlistItemCreateManyArgs>(args?: SelectSubset<T, WishlistItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WishlistItems and returns the data saved in the database.
     * @param {WishlistItemCreateManyAndReturnArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WishlistItems and only return the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WishlistItemCreateManyAndReturnArgs>(args?: SelectSubset<T, WishlistItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WishlistItem.
     * @param {WishlistItemDeleteArgs} args - Arguments to delete one WishlistItem.
     * @example
     * // Delete one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.delete({
     *   where: {
     *     // ... filter to delete one WishlistItem
     *   }
     * })
     * 
     */
    delete<T extends WishlistItemDeleteArgs>(args: SelectSubset<T, WishlistItemDeleteArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WishlistItem.
     * @param {WishlistItemUpdateArgs} args - Arguments to update one WishlistItem.
     * @example
     * // Update one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WishlistItemUpdateArgs>(args: SelectSubset<T, WishlistItemUpdateArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WishlistItems.
     * @param {WishlistItemDeleteManyArgs} args - Arguments to filter WishlistItems to delete.
     * @example
     * // Delete a few WishlistItems
     * const { count } = await prisma.wishlistItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WishlistItemDeleteManyArgs>(args?: SelectSubset<T, WishlistItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WishlistItemUpdateManyArgs>(args: SelectSubset<T, WishlistItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WishlistItem.
     * @param {WishlistItemUpsertArgs} args - Arguments to update or create a WishlistItem.
     * @example
     * // Update or create a WishlistItem
     * const wishlistItem = await prisma.wishlistItem.upsert({
     *   create: {
     *     // ... data to create a WishlistItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WishlistItem we want to update
     *   }
     * })
     */
    upsert<T extends WishlistItemUpsertArgs>(args: SelectSubset<T, WishlistItemUpsertArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemCountArgs} args - Arguments to filter WishlistItems to count.
     * @example
     * // Count the number of WishlistItems
     * const count = await prisma.wishlistItem.count({
     *   where: {
     *     // ... the filter for the WishlistItems we want to count
     *   }
     * })
    **/
    count<T extends WishlistItemCountArgs>(
      args?: Subset<T, WishlistItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WishlistItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WishlistItemAggregateArgs>(args: Subset<T, WishlistItemAggregateArgs>): Prisma.PrismaPromise<GetWishlistItemAggregateType<T>>

    /**
     * Group by WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WishlistItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WishlistItemGroupByArgs['orderBy'] }
        : { orderBy?: WishlistItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WishlistItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWishlistItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WishlistItem model
   */
  readonly fields: WishlistItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WishlistItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WishlistItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WishlistItem model
   */ 
  interface WishlistItemFieldRefs {
    readonly id: FieldRef<"WishlistItem", 'String'>
    readonly name: FieldRef<"WishlistItem", 'String'>
    readonly price: FieldRef<"WishlistItem", 'String'>
    readonly url: FieldRef<"WishlistItem", 'String'>
    readonly priority: FieldRef<"WishlistItem", 'String'>
    readonly createdAt: FieldRef<"WishlistItem", 'DateTime'>
    readonly updatedAt: FieldRef<"WishlistItem", 'DateTime'>
    readonly imageUrl: FieldRef<"WishlistItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WishlistItem findUnique
   */
  export type WishlistItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem findUniqueOrThrow
   */
  export type WishlistItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem findFirst
   */
  export type WishlistItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem findFirstOrThrow
   */
  export type WishlistItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem findMany
   */
  export type WishlistItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Filter, which WishlistItems to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem create
   */
  export type WishlistItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * The data needed to create a WishlistItem.
     */
    data: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>
  }

  /**
   * WishlistItem createMany
   */
  export type WishlistItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WishlistItem createManyAndReturn
   */
  export type WishlistItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WishlistItem update
   */
  export type WishlistItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * The data needed to update a WishlistItem.
     */
    data: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>
    /**
     * Choose, which WishlistItem to update.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem updateMany
   */
  export type WishlistItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WishlistItems.
     */
    data: XOR<WishlistItemUpdateManyMutationInput, WishlistItemUncheckedUpdateManyInput>
    /**
     * Filter which WishlistItems to update
     */
    where?: WishlistItemWhereInput
  }

  /**
   * WishlistItem upsert
   */
  export type WishlistItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * The filter to search for the WishlistItem to update in case it exists.
     */
    where: WishlistItemWhereUniqueInput
    /**
     * In case the WishlistItem found by the `where` argument doesn't exist, create a new WishlistItem with this data.
     */
    create: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>
    /**
     * In case the WishlistItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>
  }

  /**
   * WishlistItem delete
   */
  export type WishlistItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Filter which WishlistItem to delete.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem deleteMany
   */
  export type WishlistItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WishlistItems to delete
     */
    where?: WishlistItemWhereInput
  }

  /**
   * WishlistItem without action
   */
  export type WishlistItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
  }


  /**
   * Model Song
   */

  export type AggregateSong = {
    _count: SongCountAggregateOutputType | null
    _avg: SongAvgAggregateOutputType | null
    _sum: SongSumAggregateOutputType | null
    _min: SongMinAggregateOutputType | null
    _max: SongMaxAggregateOutputType | null
  }

  export type SongAvgAggregateOutputType = {
    duration: number | null
  }

  export type SongSumAggregateOutputType = {
    duration: number | null
  }

  export type SongMinAggregateOutputType = {
    id: string | null
    title: string | null
    audioUrl: string | null
    source: string | null
    duration: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SongMaxAggregateOutputType = {
    id: string | null
    title: string | null
    audioUrl: string | null
    source: string | null
    duration: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SongCountAggregateOutputType = {
    id: number
    title: number
    audioUrl: number
    source: number
    duration: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SongAvgAggregateInputType = {
    duration?: true
  }

  export type SongSumAggregateInputType = {
    duration?: true
  }

  export type SongMinAggregateInputType = {
    id?: true
    title?: true
    audioUrl?: true
    source?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SongMaxAggregateInputType = {
    id?: true
    title?: true
    audioUrl?: true
    source?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SongCountAggregateInputType = {
    id?: true
    title?: true
    audioUrl?: true
    source?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SongAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Song to aggregate.
     */
    where?: SongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Songs to fetch.
     */
    orderBy?: SongOrderByWithRelationInput | SongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Songs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Songs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Songs
    **/
    _count?: true | SongCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SongAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SongSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SongMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SongMaxAggregateInputType
  }

  export type GetSongAggregateType<T extends SongAggregateArgs> = {
        [P in keyof T & keyof AggregateSong]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSong[P]>
      : GetScalarType<T[P], AggregateSong[P]>
  }




  export type SongGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SongWhereInput
    orderBy?: SongOrderByWithAggregationInput | SongOrderByWithAggregationInput[]
    by: SongScalarFieldEnum[] | SongScalarFieldEnum
    having?: SongScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SongCountAggregateInputType | true
    _avg?: SongAvgAggregateInputType
    _sum?: SongSumAggregateInputType
    _min?: SongMinAggregateInputType
    _max?: SongMaxAggregateInputType
  }

  export type SongGroupByOutputType = {
    id: string
    title: string
    audioUrl: string
    source: string
    duration: number | null
    createdAt: Date
    updatedAt: Date
    _count: SongCountAggregateOutputType | null
    _avg: SongAvgAggregateOutputType | null
    _sum: SongSumAggregateOutputType | null
    _min: SongMinAggregateOutputType | null
    _max: SongMaxAggregateOutputType | null
  }

  type GetSongGroupByPayload<T extends SongGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SongGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SongGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SongGroupByOutputType[P]>
            : GetScalarType<T[P], SongGroupByOutputType[P]>
        }
      >
    >


  export type SongSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    audioUrl?: boolean
    source?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    playlists?: boolean | Song$playlistsArgs<ExtArgs>
    _count?: boolean | SongCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["song"]>

  export type SongSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    audioUrl?: boolean
    source?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["song"]>

  export type SongSelectScalar = {
    id?: boolean
    title?: boolean
    audioUrl?: boolean
    source?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SongInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    playlists?: boolean | Song$playlistsArgs<ExtArgs>
    _count?: boolean | SongCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SongIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SongPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Song"
    objects: {
      playlists: Prisma.$PlaylistSongPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      audioUrl: string
      source: string
      duration: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["song"]>
    composites: {}
  }

  type SongGetPayload<S extends boolean | null | undefined | SongDefaultArgs> = $Result.GetResult<Prisma.$SongPayload, S>

  type SongCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SongFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SongCountAggregateInputType | true
    }

  export interface SongDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Song'], meta: { name: 'Song' } }
    /**
     * Find zero or one Song that matches the filter.
     * @param {SongFindUniqueArgs} args - Arguments to find a Song
     * @example
     * // Get one Song
     * const song = await prisma.song.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SongFindUniqueArgs>(args: SelectSubset<T, SongFindUniqueArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Song that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SongFindUniqueOrThrowArgs} args - Arguments to find a Song
     * @example
     * // Get one Song
     * const song = await prisma.song.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SongFindUniqueOrThrowArgs>(args: SelectSubset<T, SongFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Song that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongFindFirstArgs} args - Arguments to find a Song
     * @example
     * // Get one Song
     * const song = await prisma.song.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SongFindFirstArgs>(args?: SelectSubset<T, SongFindFirstArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Song that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongFindFirstOrThrowArgs} args - Arguments to find a Song
     * @example
     * // Get one Song
     * const song = await prisma.song.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SongFindFirstOrThrowArgs>(args?: SelectSubset<T, SongFindFirstOrThrowArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Songs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Songs
     * const songs = await prisma.song.findMany()
     * 
     * // Get first 10 Songs
     * const songs = await prisma.song.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const songWithIdOnly = await prisma.song.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SongFindManyArgs>(args?: SelectSubset<T, SongFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Song.
     * @param {SongCreateArgs} args - Arguments to create a Song.
     * @example
     * // Create one Song
     * const Song = await prisma.song.create({
     *   data: {
     *     // ... data to create a Song
     *   }
     * })
     * 
     */
    create<T extends SongCreateArgs>(args: SelectSubset<T, SongCreateArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Songs.
     * @param {SongCreateManyArgs} args - Arguments to create many Songs.
     * @example
     * // Create many Songs
     * const song = await prisma.song.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SongCreateManyArgs>(args?: SelectSubset<T, SongCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Songs and returns the data saved in the database.
     * @param {SongCreateManyAndReturnArgs} args - Arguments to create many Songs.
     * @example
     * // Create many Songs
     * const song = await prisma.song.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Songs and only return the `id`
     * const songWithIdOnly = await prisma.song.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SongCreateManyAndReturnArgs>(args?: SelectSubset<T, SongCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Song.
     * @param {SongDeleteArgs} args - Arguments to delete one Song.
     * @example
     * // Delete one Song
     * const Song = await prisma.song.delete({
     *   where: {
     *     // ... filter to delete one Song
     *   }
     * })
     * 
     */
    delete<T extends SongDeleteArgs>(args: SelectSubset<T, SongDeleteArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Song.
     * @param {SongUpdateArgs} args - Arguments to update one Song.
     * @example
     * // Update one Song
     * const song = await prisma.song.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SongUpdateArgs>(args: SelectSubset<T, SongUpdateArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Songs.
     * @param {SongDeleteManyArgs} args - Arguments to filter Songs to delete.
     * @example
     * // Delete a few Songs
     * const { count } = await prisma.song.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SongDeleteManyArgs>(args?: SelectSubset<T, SongDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Songs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Songs
     * const song = await prisma.song.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SongUpdateManyArgs>(args: SelectSubset<T, SongUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Song.
     * @param {SongUpsertArgs} args - Arguments to update or create a Song.
     * @example
     * // Update or create a Song
     * const song = await prisma.song.upsert({
     *   create: {
     *     // ... data to create a Song
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Song we want to update
     *   }
     * })
     */
    upsert<T extends SongUpsertArgs>(args: SelectSubset<T, SongUpsertArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Songs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongCountArgs} args - Arguments to filter Songs to count.
     * @example
     * // Count the number of Songs
     * const count = await prisma.song.count({
     *   where: {
     *     // ... the filter for the Songs we want to count
     *   }
     * })
    **/
    count<T extends SongCountArgs>(
      args?: Subset<T, SongCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SongCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Song.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SongAggregateArgs>(args: Subset<T, SongAggregateArgs>): Prisma.PrismaPromise<GetSongAggregateType<T>>

    /**
     * Group by Song.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SongGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SongGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SongGroupByArgs['orderBy'] }
        : { orderBy?: SongGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SongGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSongGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Song model
   */
  readonly fields: SongFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Song.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SongClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    playlists<T extends Song$playlistsArgs<ExtArgs> = {}>(args?: Subset<T, Song$playlistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Song model
   */ 
  interface SongFieldRefs {
    readonly id: FieldRef<"Song", 'String'>
    readonly title: FieldRef<"Song", 'String'>
    readonly audioUrl: FieldRef<"Song", 'String'>
    readonly source: FieldRef<"Song", 'String'>
    readonly duration: FieldRef<"Song", 'Int'>
    readonly createdAt: FieldRef<"Song", 'DateTime'>
    readonly updatedAt: FieldRef<"Song", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Song findUnique
   */
  export type SongFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * Filter, which Song to fetch.
     */
    where: SongWhereUniqueInput
  }

  /**
   * Song findUniqueOrThrow
   */
  export type SongFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * Filter, which Song to fetch.
     */
    where: SongWhereUniqueInput
  }

  /**
   * Song findFirst
   */
  export type SongFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * Filter, which Song to fetch.
     */
    where?: SongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Songs to fetch.
     */
    orderBy?: SongOrderByWithRelationInput | SongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Songs.
     */
    cursor?: SongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Songs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Songs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Songs.
     */
    distinct?: SongScalarFieldEnum | SongScalarFieldEnum[]
  }

  /**
   * Song findFirstOrThrow
   */
  export type SongFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * Filter, which Song to fetch.
     */
    where?: SongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Songs to fetch.
     */
    orderBy?: SongOrderByWithRelationInput | SongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Songs.
     */
    cursor?: SongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Songs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Songs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Songs.
     */
    distinct?: SongScalarFieldEnum | SongScalarFieldEnum[]
  }

  /**
   * Song findMany
   */
  export type SongFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * Filter, which Songs to fetch.
     */
    where?: SongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Songs to fetch.
     */
    orderBy?: SongOrderByWithRelationInput | SongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Songs.
     */
    cursor?: SongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Songs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Songs.
     */
    skip?: number
    distinct?: SongScalarFieldEnum | SongScalarFieldEnum[]
  }

  /**
   * Song create
   */
  export type SongCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * The data needed to create a Song.
     */
    data: XOR<SongCreateInput, SongUncheckedCreateInput>
  }

  /**
   * Song createMany
   */
  export type SongCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Songs.
     */
    data: SongCreateManyInput | SongCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Song createManyAndReturn
   */
  export type SongCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Songs.
     */
    data: SongCreateManyInput | SongCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Song update
   */
  export type SongUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * The data needed to update a Song.
     */
    data: XOR<SongUpdateInput, SongUncheckedUpdateInput>
    /**
     * Choose, which Song to update.
     */
    where: SongWhereUniqueInput
  }

  /**
   * Song updateMany
   */
  export type SongUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Songs.
     */
    data: XOR<SongUpdateManyMutationInput, SongUncheckedUpdateManyInput>
    /**
     * Filter which Songs to update
     */
    where?: SongWhereInput
  }

  /**
   * Song upsert
   */
  export type SongUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * The filter to search for the Song to update in case it exists.
     */
    where: SongWhereUniqueInput
    /**
     * In case the Song found by the `where` argument doesn't exist, create a new Song with this data.
     */
    create: XOR<SongCreateInput, SongUncheckedCreateInput>
    /**
     * In case the Song was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SongUpdateInput, SongUncheckedUpdateInput>
  }

  /**
   * Song delete
   */
  export type SongDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
    /**
     * Filter which Song to delete.
     */
    where: SongWhereUniqueInput
  }

  /**
   * Song deleteMany
   */
  export type SongDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Songs to delete
     */
    where?: SongWhereInput
  }

  /**
   * Song.playlists
   */
  export type Song$playlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    where?: PlaylistSongWhereInput
    orderBy?: PlaylistSongOrderByWithRelationInput | PlaylistSongOrderByWithRelationInput[]
    cursor?: PlaylistSongWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlaylistSongScalarFieldEnum | PlaylistSongScalarFieldEnum[]
  }

  /**
   * Song without action
   */
  export type SongDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Song
     */
    select?: SongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SongInclude<ExtArgs> | null
  }


  /**
   * Model Playlist
   */

  export type AggregatePlaylist = {
    _count: PlaylistCountAggregateOutputType | null
    _min: PlaylistMinAggregateOutputType | null
    _max: PlaylistMaxAggregateOutputType | null
  }

  export type PlaylistMinAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    description: string | null
    philosophy: string | null
    schedule: string | null
    coverColor: string | null
    coverImage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlaylistMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    description: string | null
    philosophy: string | null
    schedule: string | null
    coverColor: string | null
    coverImage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlaylistCountAggregateOutputType = {
    id: number
    slug: number
    title: number
    description: number
    philosophy: number
    schedule: number
    vibes: number
    coverColor: number
    coverImage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlaylistMinAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    philosophy?: true
    schedule?: true
    coverColor?: true
    coverImage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlaylistMaxAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    philosophy?: true
    schedule?: true
    coverColor?: true
    coverImage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlaylistCountAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    philosophy?: true
    schedule?: true
    vibes?: true
    coverColor?: true
    coverImage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlaylistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Playlist to aggregate.
     */
    where?: PlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Playlists to fetch.
     */
    orderBy?: PlaylistOrderByWithRelationInput | PlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Playlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Playlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Playlists
    **/
    _count?: true | PlaylistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlaylistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlaylistMaxAggregateInputType
  }

  export type GetPlaylistAggregateType<T extends PlaylistAggregateArgs> = {
        [P in keyof T & keyof AggregatePlaylist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlaylist[P]>
      : GetScalarType<T[P], AggregatePlaylist[P]>
  }




  export type PlaylistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaylistWhereInput
    orderBy?: PlaylistOrderByWithAggregationInput | PlaylistOrderByWithAggregationInput[]
    by: PlaylistScalarFieldEnum[] | PlaylistScalarFieldEnum
    having?: PlaylistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlaylistCountAggregateInputType | true
    _min?: PlaylistMinAggregateInputType
    _max?: PlaylistMaxAggregateInputType
  }

  export type PlaylistGroupByOutputType = {
    id: string
    slug: string
    title: string
    description: string | null
    philosophy: string | null
    schedule: string | null
    vibes: string[]
    coverColor: string | null
    coverImage: string | null
    createdAt: Date
    updatedAt: Date
    _count: PlaylistCountAggregateOutputType | null
    _min: PlaylistMinAggregateOutputType | null
    _max: PlaylistMaxAggregateOutputType | null
  }

  type GetPlaylistGroupByPayload<T extends PlaylistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlaylistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlaylistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlaylistGroupByOutputType[P]>
            : GetScalarType<T[P], PlaylistGroupByOutputType[P]>
        }
      >
    >


  export type PlaylistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    philosophy?: boolean
    schedule?: boolean
    vibes?: boolean
    coverColor?: boolean
    coverImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    songs?: boolean | Playlist$songsArgs<ExtArgs>
    _count?: boolean | PlaylistCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playlist"]>

  export type PlaylistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    philosophy?: boolean
    schedule?: boolean
    vibes?: boolean
    coverColor?: boolean
    coverImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["playlist"]>

  export type PlaylistSelectScalar = {
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    philosophy?: boolean
    schedule?: boolean
    vibes?: boolean
    coverColor?: boolean
    coverImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlaylistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    songs?: boolean | Playlist$songsArgs<ExtArgs>
    _count?: boolean | PlaylistCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlaylistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlaylistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Playlist"
    objects: {
      songs: Prisma.$PlaylistSongPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      title: string
      description: string | null
      philosophy: string | null
      schedule: string | null
      vibes: string[]
      coverColor: string | null
      coverImage: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["playlist"]>
    composites: {}
  }

  type PlaylistGetPayload<S extends boolean | null | undefined | PlaylistDefaultArgs> = $Result.GetResult<Prisma.$PlaylistPayload, S>

  type PlaylistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlaylistFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlaylistCountAggregateInputType | true
    }

  export interface PlaylistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Playlist'], meta: { name: 'Playlist' } }
    /**
     * Find zero or one Playlist that matches the filter.
     * @param {PlaylistFindUniqueArgs} args - Arguments to find a Playlist
     * @example
     * // Get one Playlist
     * const playlist = await prisma.playlist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlaylistFindUniqueArgs>(args: SelectSubset<T, PlaylistFindUniqueArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Playlist that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlaylistFindUniqueOrThrowArgs} args - Arguments to find a Playlist
     * @example
     * // Get one Playlist
     * const playlist = await prisma.playlist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlaylistFindUniqueOrThrowArgs>(args: SelectSubset<T, PlaylistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Playlist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistFindFirstArgs} args - Arguments to find a Playlist
     * @example
     * // Get one Playlist
     * const playlist = await prisma.playlist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlaylistFindFirstArgs>(args?: SelectSubset<T, PlaylistFindFirstArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Playlist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistFindFirstOrThrowArgs} args - Arguments to find a Playlist
     * @example
     * // Get one Playlist
     * const playlist = await prisma.playlist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlaylistFindFirstOrThrowArgs>(args?: SelectSubset<T, PlaylistFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Playlists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Playlists
     * const playlists = await prisma.playlist.findMany()
     * 
     * // Get first 10 Playlists
     * const playlists = await prisma.playlist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playlistWithIdOnly = await prisma.playlist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlaylistFindManyArgs>(args?: SelectSubset<T, PlaylistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Playlist.
     * @param {PlaylistCreateArgs} args - Arguments to create a Playlist.
     * @example
     * // Create one Playlist
     * const Playlist = await prisma.playlist.create({
     *   data: {
     *     // ... data to create a Playlist
     *   }
     * })
     * 
     */
    create<T extends PlaylistCreateArgs>(args: SelectSubset<T, PlaylistCreateArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Playlists.
     * @param {PlaylistCreateManyArgs} args - Arguments to create many Playlists.
     * @example
     * // Create many Playlists
     * const playlist = await prisma.playlist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlaylistCreateManyArgs>(args?: SelectSubset<T, PlaylistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Playlists and returns the data saved in the database.
     * @param {PlaylistCreateManyAndReturnArgs} args - Arguments to create many Playlists.
     * @example
     * // Create many Playlists
     * const playlist = await prisma.playlist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Playlists and only return the `id`
     * const playlistWithIdOnly = await prisma.playlist.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlaylistCreateManyAndReturnArgs>(args?: SelectSubset<T, PlaylistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Playlist.
     * @param {PlaylistDeleteArgs} args - Arguments to delete one Playlist.
     * @example
     * // Delete one Playlist
     * const Playlist = await prisma.playlist.delete({
     *   where: {
     *     // ... filter to delete one Playlist
     *   }
     * })
     * 
     */
    delete<T extends PlaylistDeleteArgs>(args: SelectSubset<T, PlaylistDeleteArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Playlist.
     * @param {PlaylistUpdateArgs} args - Arguments to update one Playlist.
     * @example
     * // Update one Playlist
     * const playlist = await prisma.playlist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlaylistUpdateArgs>(args: SelectSubset<T, PlaylistUpdateArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Playlists.
     * @param {PlaylistDeleteManyArgs} args - Arguments to filter Playlists to delete.
     * @example
     * // Delete a few Playlists
     * const { count } = await prisma.playlist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlaylistDeleteManyArgs>(args?: SelectSubset<T, PlaylistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Playlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Playlists
     * const playlist = await prisma.playlist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlaylistUpdateManyArgs>(args: SelectSubset<T, PlaylistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Playlist.
     * @param {PlaylistUpsertArgs} args - Arguments to update or create a Playlist.
     * @example
     * // Update or create a Playlist
     * const playlist = await prisma.playlist.upsert({
     *   create: {
     *     // ... data to create a Playlist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Playlist we want to update
     *   }
     * })
     */
    upsert<T extends PlaylistUpsertArgs>(args: SelectSubset<T, PlaylistUpsertArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Playlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistCountArgs} args - Arguments to filter Playlists to count.
     * @example
     * // Count the number of Playlists
     * const count = await prisma.playlist.count({
     *   where: {
     *     // ... the filter for the Playlists we want to count
     *   }
     * })
    **/
    count<T extends PlaylistCountArgs>(
      args?: Subset<T, PlaylistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlaylistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Playlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlaylistAggregateArgs>(args: Subset<T, PlaylistAggregateArgs>): Prisma.PrismaPromise<GetPlaylistAggregateType<T>>

    /**
     * Group by Playlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlaylistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlaylistGroupByArgs['orderBy'] }
        : { orderBy?: PlaylistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlaylistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlaylistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Playlist model
   */
  readonly fields: PlaylistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Playlist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlaylistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    songs<T extends Playlist$songsArgs<ExtArgs> = {}>(args?: Subset<T, Playlist$songsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Playlist model
   */ 
  interface PlaylistFieldRefs {
    readonly id: FieldRef<"Playlist", 'String'>
    readonly slug: FieldRef<"Playlist", 'String'>
    readonly title: FieldRef<"Playlist", 'String'>
    readonly description: FieldRef<"Playlist", 'String'>
    readonly philosophy: FieldRef<"Playlist", 'String'>
    readonly schedule: FieldRef<"Playlist", 'String'>
    readonly vibes: FieldRef<"Playlist", 'String[]'>
    readonly coverColor: FieldRef<"Playlist", 'String'>
    readonly coverImage: FieldRef<"Playlist", 'String'>
    readonly createdAt: FieldRef<"Playlist", 'DateTime'>
    readonly updatedAt: FieldRef<"Playlist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Playlist findUnique
   */
  export type PlaylistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * Filter, which Playlist to fetch.
     */
    where: PlaylistWhereUniqueInput
  }

  /**
   * Playlist findUniqueOrThrow
   */
  export type PlaylistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * Filter, which Playlist to fetch.
     */
    where: PlaylistWhereUniqueInput
  }

  /**
   * Playlist findFirst
   */
  export type PlaylistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * Filter, which Playlist to fetch.
     */
    where?: PlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Playlists to fetch.
     */
    orderBy?: PlaylistOrderByWithRelationInput | PlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Playlists.
     */
    cursor?: PlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Playlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Playlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Playlists.
     */
    distinct?: PlaylistScalarFieldEnum | PlaylistScalarFieldEnum[]
  }

  /**
   * Playlist findFirstOrThrow
   */
  export type PlaylistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * Filter, which Playlist to fetch.
     */
    where?: PlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Playlists to fetch.
     */
    orderBy?: PlaylistOrderByWithRelationInput | PlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Playlists.
     */
    cursor?: PlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Playlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Playlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Playlists.
     */
    distinct?: PlaylistScalarFieldEnum | PlaylistScalarFieldEnum[]
  }

  /**
   * Playlist findMany
   */
  export type PlaylistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * Filter, which Playlists to fetch.
     */
    where?: PlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Playlists to fetch.
     */
    orderBy?: PlaylistOrderByWithRelationInput | PlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Playlists.
     */
    cursor?: PlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Playlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Playlists.
     */
    skip?: number
    distinct?: PlaylistScalarFieldEnum | PlaylistScalarFieldEnum[]
  }

  /**
   * Playlist create
   */
  export type PlaylistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * The data needed to create a Playlist.
     */
    data: XOR<PlaylistCreateInput, PlaylistUncheckedCreateInput>
  }

  /**
   * Playlist createMany
   */
  export type PlaylistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Playlists.
     */
    data: PlaylistCreateManyInput | PlaylistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Playlist createManyAndReturn
   */
  export type PlaylistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Playlists.
     */
    data: PlaylistCreateManyInput | PlaylistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Playlist update
   */
  export type PlaylistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * The data needed to update a Playlist.
     */
    data: XOR<PlaylistUpdateInput, PlaylistUncheckedUpdateInput>
    /**
     * Choose, which Playlist to update.
     */
    where: PlaylistWhereUniqueInput
  }

  /**
   * Playlist updateMany
   */
  export type PlaylistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Playlists.
     */
    data: XOR<PlaylistUpdateManyMutationInput, PlaylistUncheckedUpdateManyInput>
    /**
     * Filter which Playlists to update
     */
    where?: PlaylistWhereInput
  }

  /**
   * Playlist upsert
   */
  export type PlaylistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * The filter to search for the Playlist to update in case it exists.
     */
    where: PlaylistWhereUniqueInput
    /**
     * In case the Playlist found by the `where` argument doesn't exist, create a new Playlist with this data.
     */
    create: XOR<PlaylistCreateInput, PlaylistUncheckedCreateInput>
    /**
     * In case the Playlist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlaylistUpdateInput, PlaylistUncheckedUpdateInput>
  }

  /**
   * Playlist delete
   */
  export type PlaylistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
    /**
     * Filter which Playlist to delete.
     */
    where: PlaylistWhereUniqueInput
  }

  /**
   * Playlist deleteMany
   */
  export type PlaylistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Playlists to delete
     */
    where?: PlaylistWhereInput
  }

  /**
   * Playlist.songs
   */
  export type Playlist$songsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    where?: PlaylistSongWhereInput
    orderBy?: PlaylistSongOrderByWithRelationInput | PlaylistSongOrderByWithRelationInput[]
    cursor?: PlaylistSongWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlaylistSongScalarFieldEnum | PlaylistSongScalarFieldEnum[]
  }

  /**
   * Playlist without action
   */
  export type PlaylistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Playlist
     */
    select?: PlaylistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistInclude<ExtArgs> | null
  }


  /**
   * Model PlaylistSong
   */

  export type AggregatePlaylistSong = {
    _count: PlaylistSongCountAggregateOutputType | null
    _avg: PlaylistSongAvgAggregateOutputType | null
    _sum: PlaylistSongSumAggregateOutputType | null
    _min: PlaylistSongMinAggregateOutputType | null
    _max: PlaylistSongMaxAggregateOutputType | null
  }

  export type PlaylistSongAvgAggregateOutputType = {
    order: number | null
  }

  export type PlaylistSongSumAggregateOutputType = {
    order: number | null
  }

  export type PlaylistSongMinAggregateOutputType = {
    playlistId: string | null
    songId: string | null
    order: number | null
  }

  export type PlaylistSongMaxAggregateOutputType = {
    playlistId: string | null
    songId: string | null
    order: number | null
  }

  export type PlaylistSongCountAggregateOutputType = {
    playlistId: number
    songId: number
    order: number
    _all: number
  }


  export type PlaylistSongAvgAggregateInputType = {
    order?: true
  }

  export type PlaylistSongSumAggregateInputType = {
    order?: true
  }

  export type PlaylistSongMinAggregateInputType = {
    playlistId?: true
    songId?: true
    order?: true
  }

  export type PlaylistSongMaxAggregateInputType = {
    playlistId?: true
    songId?: true
    order?: true
  }

  export type PlaylistSongCountAggregateInputType = {
    playlistId?: true
    songId?: true
    order?: true
    _all?: true
  }

  export type PlaylistSongAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlaylistSong to aggregate.
     */
    where?: PlaylistSongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlaylistSongs to fetch.
     */
    orderBy?: PlaylistSongOrderByWithRelationInput | PlaylistSongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlaylistSongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlaylistSongs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlaylistSongs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlaylistSongs
    **/
    _count?: true | PlaylistSongCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlaylistSongAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlaylistSongSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlaylistSongMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlaylistSongMaxAggregateInputType
  }

  export type GetPlaylistSongAggregateType<T extends PlaylistSongAggregateArgs> = {
        [P in keyof T & keyof AggregatePlaylistSong]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlaylistSong[P]>
      : GetScalarType<T[P], AggregatePlaylistSong[P]>
  }




  export type PlaylistSongGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaylistSongWhereInput
    orderBy?: PlaylistSongOrderByWithAggregationInput | PlaylistSongOrderByWithAggregationInput[]
    by: PlaylistSongScalarFieldEnum[] | PlaylistSongScalarFieldEnum
    having?: PlaylistSongScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlaylistSongCountAggregateInputType | true
    _avg?: PlaylistSongAvgAggregateInputType
    _sum?: PlaylistSongSumAggregateInputType
    _min?: PlaylistSongMinAggregateInputType
    _max?: PlaylistSongMaxAggregateInputType
  }

  export type PlaylistSongGroupByOutputType = {
    playlistId: string
    songId: string
    order: number
    _count: PlaylistSongCountAggregateOutputType | null
    _avg: PlaylistSongAvgAggregateOutputType | null
    _sum: PlaylistSongSumAggregateOutputType | null
    _min: PlaylistSongMinAggregateOutputType | null
    _max: PlaylistSongMaxAggregateOutputType | null
  }

  type GetPlaylistSongGroupByPayload<T extends PlaylistSongGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlaylistSongGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlaylistSongGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlaylistSongGroupByOutputType[P]>
            : GetScalarType<T[P], PlaylistSongGroupByOutputType[P]>
        }
      >
    >


  export type PlaylistSongSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    playlistId?: boolean
    songId?: boolean
    order?: boolean
    playlist?: boolean | PlaylistDefaultArgs<ExtArgs>
    song?: boolean | SongDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playlistSong"]>

  export type PlaylistSongSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    playlistId?: boolean
    songId?: boolean
    order?: boolean
    playlist?: boolean | PlaylistDefaultArgs<ExtArgs>
    song?: boolean | SongDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playlistSong"]>

  export type PlaylistSongSelectScalar = {
    playlistId?: boolean
    songId?: boolean
    order?: boolean
  }

  export type PlaylistSongInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    playlist?: boolean | PlaylistDefaultArgs<ExtArgs>
    song?: boolean | SongDefaultArgs<ExtArgs>
  }
  export type PlaylistSongIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    playlist?: boolean | PlaylistDefaultArgs<ExtArgs>
    song?: boolean | SongDefaultArgs<ExtArgs>
  }

  export type $PlaylistSongPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlaylistSong"
    objects: {
      playlist: Prisma.$PlaylistPayload<ExtArgs>
      song: Prisma.$SongPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      playlistId: string
      songId: string
      order: number
    }, ExtArgs["result"]["playlistSong"]>
    composites: {}
  }

  type PlaylistSongGetPayload<S extends boolean | null | undefined | PlaylistSongDefaultArgs> = $Result.GetResult<Prisma.$PlaylistSongPayload, S>

  type PlaylistSongCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlaylistSongFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlaylistSongCountAggregateInputType | true
    }

  export interface PlaylistSongDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlaylistSong'], meta: { name: 'PlaylistSong' } }
    /**
     * Find zero or one PlaylistSong that matches the filter.
     * @param {PlaylistSongFindUniqueArgs} args - Arguments to find a PlaylistSong
     * @example
     * // Get one PlaylistSong
     * const playlistSong = await prisma.playlistSong.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlaylistSongFindUniqueArgs>(args: SelectSubset<T, PlaylistSongFindUniqueArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PlaylistSong that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlaylistSongFindUniqueOrThrowArgs} args - Arguments to find a PlaylistSong
     * @example
     * // Get one PlaylistSong
     * const playlistSong = await prisma.playlistSong.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlaylistSongFindUniqueOrThrowArgs>(args: SelectSubset<T, PlaylistSongFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PlaylistSong that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongFindFirstArgs} args - Arguments to find a PlaylistSong
     * @example
     * // Get one PlaylistSong
     * const playlistSong = await prisma.playlistSong.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlaylistSongFindFirstArgs>(args?: SelectSubset<T, PlaylistSongFindFirstArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PlaylistSong that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongFindFirstOrThrowArgs} args - Arguments to find a PlaylistSong
     * @example
     * // Get one PlaylistSong
     * const playlistSong = await prisma.playlistSong.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlaylistSongFindFirstOrThrowArgs>(args?: SelectSubset<T, PlaylistSongFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PlaylistSongs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlaylistSongs
     * const playlistSongs = await prisma.playlistSong.findMany()
     * 
     * // Get first 10 PlaylistSongs
     * const playlistSongs = await prisma.playlistSong.findMany({ take: 10 })
     * 
     * // Only select the `playlistId`
     * const playlistSongWithPlaylistIdOnly = await prisma.playlistSong.findMany({ select: { playlistId: true } })
     * 
     */
    findMany<T extends PlaylistSongFindManyArgs>(args?: SelectSubset<T, PlaylistSongFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PlaylistSong.
     * @param {PlaylistSongCreateArgs} args - Arguments to create a PlaylistSong.
     * @example
     * // Create one PlaylistSong
     * const PlaylistSong = await prisma.playlistSong.create({
     *   data: {
     *     // ... data to create a PlaylistSong
     *   }
     * })
     * 
     */
    create<T extends PlaylistSongCreateArgs>(args: SelectSubset<T, PlaylistSongCreateArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PlaylistSongs.
     * @param {PlaylistSongCreateManyArgs} args - Arguments to create many PlaylistSongs.
     * @example
     * // Create many PlaylistSongs
     * const playlistSong = await prisma.playlistSong.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlaylistSongCreateManyArgs>(args?: SelectSubset<T, PlaylistSongCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlaylistSongs and returns the data saved in the database.
     * @param {PlaylistSongCreateManyAndReturnArgs} args - Arguments to create many PlaylistSongs.
     * @example
     * // Create many PlaylistSongs
     * const playlistSong = await prisma.playlistSong.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlaylistSongs and only return the `playlistId`
     * const playlistSongWithPlaylistIdOnly = await prisma.playlistSong.createManyAndReturn({ 
     *   select: { playlistId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlaylistSongCreateManyAndReturnArgs>(args?: SelectSubset<T, PlaylistSongCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PlaylistSong.
     * @param {PlaylistSongDeleteArgs} args - Arguments to delete one PlaylistSong.
     * @example
     * // Delete one PlaylistSong
     * const PlaylistSong = await prisma.playlistSong.delete({
     *   where: {
     *     // ... filter to delete one PlaylistSong
     *   }
     * })
     * 
     */
    delete<T extends PlaylistSongDeleteArgs>(args: SelectSubset<T, PlaylistSongDeleteArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PlaylistSong.
     * @param {PlaylistSongUpdateArgs} args - Arguments to update one PlaylistSong.
     * @example
     * // Update one PlaylistSong
     * const playlistSong = await prisma.playlistSong.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlaylistSongUpdateArgs>(args: SelectSubset<T, PlaylistSongUpdateArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PlaylistSongs.
     * @param {PlaylistSongDeleteManyArgs} args - Arguments to filter PlaylistSongs to delete.
     * @example
     * // Delete a few PlaylistSongs
     * const { count } = await prisma.playlistSong.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlaylistSongDeleteManyArgs>(args?: SelectSubset<T, PlaylistSongDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlaylistSongs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlaylistSongs
     * const playlistSong = await prisma.playlistSong.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlaylistSongUpdateManyArgs>(args: SelectSubset<T, PlaylistSongUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PlaylistSong.
     * @param {PlaylistSongUpsertArgs} args - Arguments to update or create a PlaylistSong.
     * @example
     * // Update or create a PlaylistSong
     * const playlistSong = await prisma.playlistSong.upsert({
     *   create: {
     *     // ... data to create a PlaylistSong
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlaylistSong we want to update
     *   }
     * })
     */
    upsert<T extends PlaylistSongUpsertArgs>(args: SelectSubset<T, PlaylistSongUpsertArgs<ExtArgs>>): Prisma__PlaylistSongClient<$Result.GetResult<Prisma.$PlaylistSongPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PlaylistSongs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongCountArgs} args - Arguments to filter PlaylistSongs to count.
     * @example
     * // Count the number of PlaylistSongs
     * const count = await prisma.playlistSong.count({
     *   where: {
     *     // ... the filter for the PlaylistSongs we want to count
     *   }
     * })
    **/
    count<T extends PlaylistSongCountArgs>(
      args?: Subset<T, PlaylistSongCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlaylistSongCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlaylistSong.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlaylistSongAggregateArgs>(args: Subset<T, PlaylistSongAggregateArgs>): Prisma.PrismaPromise<GetPlaylistSongAggregateType<T>>

    /**
     * Group by PlaylistSong.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaylistSongGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlaylistSongGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlaylistSongGroupByArgs['orderBy'] }
        : { orderBy?: PlaylistSongGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlaylistSongGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlaylistSongGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlaylistSong model
   */
  readonly fields: PlaylistSongFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlaylistSong.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlaylistSongClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    playlist<T extends PlaylistDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlaylistDefaultArgs<ExtArgs>>): Prisma__PlaylistClient<$Result.GetResult<Prisma.$PlaylistPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    song<T extends SongDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SongDefaultArgs<ExtArgs>>): Prisma__SongClient<$Result.GetResult<Prisma.$SongPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlaylistSong model
   */ 
  interface PlaylistSongFieldRefs {
    readonly playlistId: FieldRef<"PlaylistSong", 'String'>
    readonly songId: FieldRef<"PlaylistSong", 'String'>
    readonly order: FieldRef<"PlaylistSong", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * PlaylistSong findUnique
   */
  export type PlaylistSongFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * Filter, which PlaylistSong to fetch.
     */
    where: PlaylistSongWhereUniqueInput
  }

  /**
   * PlaylistSong findUniqueOrThrow
   */
  export type PlaylistSongFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * Filter, which PlaylistSong to fetch.
     */
    where: PlaylistSongWhereUniqueInput
  }

  /**
   * PlaylistSong findFirst
   */
  export type PlaylistSongFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * Filter, which PlaylistSong to fetch.
     */
    where?: PlaylistSongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlaylistSongs to fetch.
     */
    orderBy?: PlaylistSongOrderByWithRelationInput | PlaylistSongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlaylistSongs.
     */
    cursor?: PlaylistSongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlaylistSongs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlaylistSongs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlaylistSongs.
     */
    distinct?: PlaylistSongScalarFieldEnum | PlaylistSongScalarFieldEnum[]
  }

  /**
   * PlaylistSong findFirstOrThrow
   */
  export type PlaylistSongFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * Filter, which PlaylistSong to fetch.
     */
    where?: PlaylistSongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlaylistSongs to fetch.
     */
    orderBy?: PlaylistSongOrderByWithRelationInput | PlaylistSongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlaylistSongs.
     */
    cursor?: PlaylistSongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlaylistSongs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlaylistSongs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlaylistSongs.
     */
    distinct?: PlaylistSongScalarFieldEnum | PlaylistSongScalarFieldEnum[]
  }

  /**
   * PlaylistSong findMany
   */
  export type PlaylistSongFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * Filter, which PlaylistSongs to fetch.
     */
    where?: PlaylistSongWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlaylistSongs to fetch.
     */
    orderBy?: PlaylistSongOrderByWithRelationInput | PlaylistSongOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlaylistSongs.
     */
    cursor?: PlaylistSongWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlaylistSongs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlaylistSongs.
     */
    skip?: number
    distinct?: PlaylistSongScalarFieldEnum | PlaylistSongScalarFieldEnum[]
  }

  /**
   * PlaylistSong create
   */
  export type PlaylistSongCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * The data needed to create a PlaylistSong.
     */
    data: XOR<PlaylistSongCreateInput, PlaylistSongUncheckedCreateInput>
  }

  /**
   * PlaylistSong createMany
   */
  export type PlaylistSongCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlaylistSongs.
     */
    data: PlaylistSongCreateManyInput | PlaylistSongCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlaylistSong createManyAndReturn
   */
  export type PlaylistSongCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PlaylistSongs.
     */
    data: PlaylistSongCreateManyInput | PlaylistSongCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlaylistSong update
   */
  export type PlaylistSongUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * The data needed to update a PlaylistSong.
     */
    data: XOR<PlaylistSongUpdateInput, PlaylistSongUncheckedUpdateInput>
    /**
     * Choose, which PlaylistSong to update.
     */
    where: PlaylistSongWhereUniqueInput
  }

  /**
   * PlaylistSong updateMany
   */
  export type PlaylistSongUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlaylistSongs.
     */
    data: XOR<PlaylistSongUpdateManyMutationInput, PlaylistSongUncheckedUpdateManyInput>
    /**
     * Filter which PlaylistSongs to update
     */
    where?: PlaylistSongWhereInput
  }

  /**
   * PlaylistSong upsert
   */
  export type PlaylistSongUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * The filter to search for the PlaylistSong to update in case it exists.
     */
    where: PlaylistSongWhereUniqueInput
    /**
     * In case the PlaylistSong found by the `where` argument doesn't exist, create a new PlaylistSong with this data.
     */
    create: XOR<PlaylistSongCreateInput, PlaylistSongUncheckedCreateInput>
    /**
     * In case the PlaylistSong was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlaylistSongUpdateInput, PlaylistSongUncheckedUpdateInput>
  }

  /**
   * PlaylistSong delete
   */
  export type PlaylistSongDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
    /**
     * Filter which PlaylistSong to delete.
     */
    where: PlaylistSongWhereUniqueInput
  }

  /**
   * PlaylistSong deleteMany
   */
  export type PlaylistSongDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlaylistSongs to delete
     */
    where?: PlaylistSongWhereInput
  }

  /**
   * PlaylistSong without action
   */
  export type PlaylistSongDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlaylistSong
     */
    select?: PlaylistSongSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaylistSongInclude<ExtArgs> | null
  }


  /**
   * Model MusicAccessLog
   */

  export type AggregateMusicAccessLog = {
    _count: MusicAccessLogCountAggregateOutputType | null
    _avg: MusicAccessLogAvgAggregateOutputType | null
    _sum: MusicAccessLogSumAggregateOutputType | null
    _min: MusicAccessLogMinAggregateOutputType | null
    _max: MusicAccessLogMaxAggregateOutputType | null
  }

  export type MusicAccessLogAvgAggregateOutputType = {
    duration: number | null
    latitude: number | null
    longitude: number | null
  }

  export type MusicAccessLogSumAggregateOutputType = {
    duration: number | null
    latitude: number | null
    longitude: number | null
  }

  export type MusicAccessLogMinAggregateOutputType = {
    id: string | null
    ip: string | null
    city: string | null
    country: string | null
    region: string | null
    isp: string | null
    userAgent: string | null
    songTitle: string | null
    sessionId: string | null
    duration: number | null
    latitude: number | null
    longitude: number | null
    timezone: string | null
    postal: string | null
    timestamp: Date | null
    lastActive: Date | null
  }

  export type MusicAccessLogMaxAggregateOutputType = {
    id: string | null
    ip: string | null
    city: string | null
    country: string | null
    region: string | null
    isp: string | null
    userAgent: string | null
    songTitle: string | null
    sessionId: string | null
    duration: number | null
    latitude: number | null
    longitude: number | null
    timezone: string | null
    postal: string | null
    timestamp: Date | null
    lastActive: Date | null
  }

  export type MusicAccessLogCountAggregateOutputType = {
    id: number
    ip: number
    city: number
    country: number
    region: number
    isp: number
    userAgent: number
    songTitle: number
    sessionId: number
    duration: number
    latitude: number
    longitude: number
    timezone: number
    postal: number
    timestamp: number
    lastActive: number
    _all: number
  }


  export type MusicAccessLogAvgAggregateInputType = {
    duration?: true
    latitude?: true
    longitude?: true
  }

  export type MusicAccessLogSumAggregateInputType = {
    duration?: true
    latitude?: true
    longitude?: true
  }

  export type MusicAccessLogMinAggregateInputType = {
    id?: true
    ip?: true
    city?: true
    country?: true
    region?: true
    isp?: true
    userAgent?: true
    songTitle?: true
    sessionId?: true
    duration?: true
    latitude?: true
    longitude?: true
    timezone?: true
    postal?: true
    timestamp?: true
    lastActive?: true
  }

  export type MusicAccessLogMaxAggregateInputType = {
    id?: true
    ip?: true
    city?: true
    country?: true
    region?: true
    isp?: true
    userAgent?: true
    songTitle?: true
    sessionId?: true
    duration?: true
    latitude?: true
    longitude?: true
    timezone?: true
    postal?: true
    timestamp?: true
    lastActive?: true
  }

  export type MusicAccessLogCountAggregateInputType = {
    id?: true
    ip?: true
    city?: true
    country?: true
    region?: true
    isp?: true
    userAgent?: true
    songTitle?: true
    sessionId?: true
    duration?: true
    latitude?: true
    longitude?: true
    timezone?: true
    postal?: true
    timestamp?: true
    lastActive?: true
    _all?: true
  }

  export type MusicAccessLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MusicAccessLog to aggregate.
     */
    where?: MusicAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicAccessLogs to fetch.
     */
    orderBy?: MusicAccessLogOrderByWithRelationInput | MusicAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MusicAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicAccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MusicAccessLogs
    **/
    _count?: true | MusicAccessLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MusicAccessLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MusicAccessLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MusicAccessLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MusicAccessLogMaxAggregateInputType
  }

  export type GetMusicAccessLogAggregateType<T extends MusicAccessLogAggregateArgs> = {
        [P in keyof T & keyof AggregateMusicAccessLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMusicAccessLog[P]>
      : GetScalarType<T[P], AggregateMusicAccessLog[P]>
  }




  export type MusicAccessLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MusicAccessLogWhereInput
    orderBy?: MusicAccessLogOrderByWithAggregationInput | MusicAccessLogOrderByWithAggregationInput[]
    by: MusicAccessLogScalarFieldEnum[] | MusicAccessLogScalarFieldEnum
    having?: MusicAccessLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MusicAccessLogCountAggregateInputType | true
    _avg?: MusicAccessLogAvgAggregateInputType
    _sum?: MusicAccessLogSumAggregateInputType
    _min?: MusicAccessLogMinAggregateInputType
    _max?: MusicAccessLogMaxAggregateInputType
  }

  export type MusicAccessLogGroupByOutputType = {
    id: string
    ip: string
    city: string | null
    country: string | null
    region: string | null
    isp: string | null
    userAgent: string | null
    songTitle: string | null
    sessionId: string | null
    duration: number
    latitude: number | null
    longitude: number | null
    timezone: string | null
    postal: string | null
    timestamp: Date
    lastActive: Date
    _count: MusicAccessLogCountAggregateOutputType | null
    _avg: MusicAccessLogAvgAggregateOutputType | null
    _sum: MusicAccessLogSumAggregateOutputType | null
    _min: MusicAccessLogMinAggregateOutputType | null
    _max: MusicAccessLogMaxAggregateOutputType | null
  }

  type GetMusicAccessLogGroupByPayload<T extends MusicAccessLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MusicAccessLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MusicAccessLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MusicAccessLogGroupByOutputType[P]>
            : GetScalarType<T[P], MusicAccessLogGroupByOutputType[P]>
        }
      >
    >


  export type MusicAccessLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ip?: boolean
    city?: boolean
    country?: boolean
    region?: boolean
    isp?: boolean
    userAgent?: boolean
    songTitle?: boolean
    sessionId?: boolean
    duration?: boolean
    latitude?: boolean
    longitude?: boolean
    timezone?: boolean
    postal?: boolean
    timestamp?: boolean
    lastActive?: boolean
  }, ExtArgs["result"]["musicAccessLog"]>

  export type MusicAccessLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ip?: boolean
    city?: boolean
    country?: boolean
    region?: boolean
    isp?: boolean
    userAgent?: boolean
    songTitle?: boolean
    sessionId?: boolean
    duration?: boolean
    latitude?: boolean
    longitude?: boolean
    timezone?: boolean
    postal?: boolean
    timestamp?: boolean
    lastActive?: boolean
  }, ExtArgs["result"]["musicAccessLog"]>

  export type MusicAccessLogSelectScalar = {
    id?: boolean
    ip?: boolean
    city?: boolean
    country?: boolean
    region?: boolean
    isp?: boolean
    userAgent?: boolean
    songTitle?: boolean
    sessionId?: boolean
    duration?: boolean
    latitude?: boolean
    longitude?: boolean
    timezone?: boolean
    postal?: boolean
    timestamp?: boolean
    lastActive?: boolean
  }


  export type $MusicAccessLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MusicAccessLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ip: string
      city: string | null
      country: string | null
      region: string | null
      isp: string | null
      userAgent: string | null
      songTitle: string | null
      sessionId: string | null
      duration: number
      latitude: number | null
      longitude: number | null
      timezone: string | null
      postal: string | null
      timestamp: Date
      lastActive: Date
    }, ExtArgs["result"]["musicAccessLog"]>
    composites: {}
  }

  type MusicAccessLogGetPayload<S extends boolean | null | undefined | MusicAccessLogDefaultArgs> = $Result.GetResult<Prisma.$MusicAccessLogPayload, S>

  type MusicAccessLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MusicAccessLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MusicAccessLogCountAggregateInputType | true
    }

  export interface MusicAccessLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MusicAccessLog'], meta: { name: 'MusicAccessLog' } }
    /**
     * Find zero or one MusicAccessLog that matches the filter.
     * @param {MusicAccessLogFindUniqueArgs} args - Arguments to find a MusicAccessLog
     * @example
     * // Get one MusicAccessLog
     * const musicAccessLog = await prisma.musicAccessLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MusicAccessLogFindUniqueArgs>(args: SelectSubset<T, MusicAccessLogFindUniqueArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MusicAccessLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MusicAccessLogFindUniqueOrThrowArgs} args - Arguments to find a MusicAccessLog
     * @example
     * // Get one MusicAccessLog
     * const musicAccessLog = await prisma.musicAccessLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MusicAccessLogFindUniqueOrThrowArgs>(args: SelectSubset<T, MusicAccessLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MusicAccessLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogFindFirstArgs} args - Arguments to find a MusicAccessLog
     * @example
     * // Get one MusicAccessLog
     * const musicAccessLog = await prisma.musicAccessLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MusicAccessLogFindFirstArgs>(args?: SelectSubset<T, MusicAccessLogFindFirstArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MusicAccessLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogFindFirstOrThrowArgs} args - Arguments to find a MusicAccessLog
     * @example
     * // Get one MusicAccessLog
     * const musicAccessLog = await prisma.musicAccessLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MusicAccessLogFindFirstOrThrowArgs>(args?: SelectSubset<T, MusicAccessLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MusicAccessLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MusicAccessLogs
     * const musicAccessLogs = await prisma.musicAccessLog.findMany()
     * 
     * // Get first 10 MusicAccessLogs
     * const musicAccessLogs = await prisma.musicAccessLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const musicAccessLogWithIdOnly = await prisma.musicAccessLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MusicAccessLogFindManyArgs>(args?: SelectSubset<T, MusicAccessLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MusicAccessLog.
     * @param {MusicAccessLogCreateArgs} args - Arguments to create a MusicAccessLog.
     * @example
     * // Create one MusicAccessLog
     * const MusicAccessLog = await prisma.musicAccessLog.create({
     *   data: {
     *     // ... data to create a MusicAccessLog
     *   }
     * })
     * 
     */
    create<T extends MusicAccessLogCreateArgs>(args: SelectSubset<T, MusicAccessLogCreateArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MusicAccessLogs.
     * @param {MusicAccessLogCreateManyArgs} args - Arguments to create many MusicAccessLogs.
     * @example
     * // Create many MusicAccessLogs
     * const musicAccessLog = await prisma.musicAccessLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MusicAccessLogCreateManyArgs>(args?: SelectSubset<T, MusicAccessLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MusicAccessLogs and returns the data saved in the database.
     * @param {MusicAccessLogCreateManyAndReturnArgs} args - Arguments to create many MusicAccessLogs.
     * @example
     * // Create many MusicAccessLogs
     * const musicAccessLog = await prisma.musicAccessLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MusicAccessLogs and only return the `id`
     * const musicAccessLogWithIdOnly = await prisma.musicAccessLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MusicAccessLogCreateManyAndReturnArgs>(args?: SelectSubset<T, MusicAccessLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MusicAccessLog.
     * @param {MusicAccessLogDeleteArgs} args - Arguments to delete one MusicAccessLog.
     * @example
     * // Delete one MusicAccessLog
     * const MusicAccessLog = await prisma.musicAccessLog.delete({
     *   where: {
     *     // ... filter to delete one MusicAccessLog
     *   }
     * })
     * 
     */
    delete<T extends MusicAccessLogDeleteArgs>(args: SelectSubset<T, MusicAccessLogDeleteArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MusicAccessLog.
     * @param {MusicAccessLogUpdateArgs} args - Arguments to update one MusicAccessLog.
     * @example
     * // Update one MusicAccessLog
     * const musicAccessLog = await prisma.musicAccessLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MusicAccessLogUpdateArgs>(args: SelectSubset<T, MusicAccessLogUpdateArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MusicAccessLogs.
     * @param {MusicAccessLogDeleteManyArgs} args - Arguments to filter MusicAccessLogs to delete.
     * @example
     * // Delete a few MusicAccessLogs
     * const { count } = await prisma.musicAccessLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MusicAccessLogDeleteManyArgs>(args?: SelectSubset<T, MusicAccessLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MusicAccessLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MusicAccessLogs
     * const musicAccessLog = await prisma.musicAccessLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MusicAccessLogUpdateManyArgs>(args: SelectSubset<T, MusicAccessLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MusicAccessLog.
     * @param {MusicAccessLogUpsertArgs} args - Arguments to update or create a MusicAccessLog.
     * @example
     * // Update or create a MusicAccessLog
     * const musicAccessLog = await prisma.musicAccessLog.upsert({
     *   create: {
     *     // ... data to create a MusicAccessLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MusicAccessLog we want to update
     *   }
     * })
     */
    upsert<T extends MusicAccessLogUpsertArgs>(args: SelectSubset<T, MusicAccessLogUpsertArgs<ExtArgs>>): Prisma__MusicAccessLogClient<$Result.GetResult<Prisma.$MusicAccessLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MusicAccessLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogCountArgs} args - Arguments to filter MusicAccessLogs to count.
     * @example
     * // Count the number of MusicAccessLogs
     * const count = await prisma.musicAccessLog.count({
     *   where: {
     *     // ... the filter for the MusicAccessLogs we want to count
     *   }
     * })
    **/
    count<T extends MusicAccessLogCountArgs>(
      args?: Subset<T, MusicAccessLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MusicAccessLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MusicAccessLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MusicAccessLogAggregateArgs>(args: Subset<T, MusicAccessLogAggregateArgs>): Prisma.PrismaPromise<GetMusicAccessLogAggregateType<T>>

    /**
     * Group by MusicAccessLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicAccessLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MusicAccessLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MusicAccessLogGroupByArgs['orderBy'] }
        : { orderBy?: MusicAccessLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MusicAccessLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMusicAccessLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MusicAccessLog model
   */
  readonly fields: MusicAccessLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MusicAccessLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MusicAccessLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MusicAccessLog model
   */ 
  interface MusicAccessLogFieldRefs {
    readonly id: FieldRef<"MusicAccessLog", 'String'>
    readonly ip: FieldRef<"MusicAccessLog", 'String'>
    readonly city: FieldRef<"MusicAccessLog", 'String'>
    readonly country: FieldRef<"MusicAccessLog", 'String'>
    readonly region: FieldRef<"MusicAccessLog", 'String'>
    readonly isp: FieldRef<"MusicAccessLog", 'String'>
    readonly userAgent: FieldRef<"MusicAccessLog", 'String'>
    readonly songTitle: FieldRef<"MusicAccessLog", 'String'>
    readonly sessionId: FieldRef<"MusicAccessLog", 'String'>
    readonly duration: FieldRef<"MusicAccessLog", 'Int'>
    readonly latitude: FieldRef<"MusicAccessLog", 'Float'>
    readonly longitude: FieldRef<"MusicAccessLog", 'Float'>
    readonly timezone: FieldRef<"MusicAccessLog", 'String'>
    readonly postal: FieldRef<"MusicAccessLog", 'String'>
    readonly timestamp: FieldRef<"MusicAccessLog", 'DateTime'>
    readonly lastActive: FieldRef<"MusicAccessLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MusicAccessLog findUnique
   */
  export type MusicAccessLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which MusicAccessLog to fetch.
     */
    where: MusicAccessLogWhereUniqueInput
  }

  /**
   * MusicAccessLog findUniqueOrThrow
   */
  export type MusicAccessLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which MusicAccessLog to fetch.
     */
    where: MusicAccessLogWhereUniqueInput
  }

  /**
   * MusicAccessLog findFirst
   */
  export type MusicAccessLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which MusicAccessLog to fetch.
     */
    where?: MusicAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicAccessLogs to fetch.
     */
    orderBy?: MusicAccessLogOrderByWithRelationInput | MusicAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MusicAccessLogs.
     */
    cursor?: MusicAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicAccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MusicAccessLogs.
     */
    distinct?: MusicAccessLogScalarFieldEnum | MusicAccessLogScalarFieldEnum[]
  }

  /**
   * MusicAccessLog findFirstOrThrow
   */
  export type MusicAccessLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which MusicAccessLog to fetch.
     */
    where?: MusicAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicAccessLogs to fetch.
     */
    orderBy?: MusicAccessLogOrderByWithRelationInput | MusicAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MusicAccessLogs.
     */
    cursor?: MusicAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicAccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MusicAccessLogs.
     */
    distinct?: MusicAccessLogScalarFieldEnum | MusicAccessLogScalarFieldEnum[]
  }

  /**
   * MusicAccessLog findMany
   */
  export type MusicAccessLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which MusicAccessLogs to fetch.
     */
    where?: MusicAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicAccessLogs to fetch.
     */
    orderBy?: MusicAccessLogOrderByWithRelationInput | MusicAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MusicAccessLogs.
     */
    cursor?: MusicAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicAccessLogs.
     */
    skip?: number
    distinct?: MusicAccessLogScalarFieldEnum | MusicAccessLogScalarFieldEnum[]
  }

  /**
   * MusicAccessLog create
   */
  export type MusicAccessLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * The data needed to create a MusicAccessLog.
     */
    data: XOR<MusicAccessLogCreateInput, MusicAccessLogUncheckedCreateInput>
  }

  /**
   * MusicAccessLog createMany
   */
  export type MusicAccessLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MusicAccessLogs.
     */
    data: MusicAccessLogCreateManyInput | MusicAccessLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MusicAccessLog createManyAndReturn
   */
  export type MusicAccessLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MusicAccessLogs.
     */
    data: MusicAccessLogCreateManyInput | MusicAccessLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MusicAccessLog update
   */
  export type MusicAccessLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * The data needed to update a MusicAccessLog.
     */
    data: XOR<MusicAccessLogUpdateInput, MusicAccessLogUncheckedUpdateInput>
    /**
     * Choose, which MusicAccessLog to update.
     */
    where: MusicAccessLogWhereUniqueInput
  }

  /**
   * MusicAccessLog updateMany
   */
  export type MusicAccessLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MusicAccessLogs.
     */
    data: XOR<MusicAccessLogUpdateManyMutationInput, MusicAccessLogUncheckedUpdateManyInput>
    /**
     * Filter which MusicAccessLogs to update
     */
    where?: MusicAccessLogWhereInput
  }

  /**
   * MusicAccessLog upsert
   */
  export type MusicAccessLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * The filter to search for the MusicAccessLog to update in case it exists.
     */
    where: MusicAccessLogWhereUniqueInput
    /**
     * In case the MusicAccessLog found by the `where` argument doesn't exist, create a new MusicAccessLog with this data.
     */
    create: XOR<MusicAccessLogCreateInput, MusicAccessLogUncheckedCreateInput>
    /**
     * In case the MusicAccessLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MusicAccessLogUpdateInput, MusicAccessLogUncheckedUpdateInput>
  }

  /**
   * MusicAccessLog delete
   */
  export type MusicAccessLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
    /**
     * Filter which MusicAccessLog to delete.
     */
    where: MusicAccessLogWhereUniqueInput
  }

  /**
   * MusicAccessLog deleteMany
   */
  export type MusicAccessLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MusicAccessLogs to delete
     */
    where?: MusicAccessLogWhereInput
  }

  /**
   * MusicAccessLog without action
   */
  export type MusicAccessLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicAccessLog
     */
    select?: MusicAccessLogSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isRead: 'isRead',
    scheduledFor: 'scheduledFor',
    imageUrl: 'imageUrl',
    url: 'url',
    category: 'category',
    isBookmarked: 'isBookmarked'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    authorName: 'authorName',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const ArticleScoreScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    substance: 'substance',
    depth: 'depth',
    structure: 'structure',
    vocabulary: 'vocabulary',
    readability: 'readability',
    specificity: 'specificity',
    actionability: 'actionability',
    engagement: 'engagement',
    total: 'total',
    updatedAt: 'updatedAt',
    socialScore: 'socialScore'
  };

  export type ArticleScoreScalarFieldEnum = (typeof ArticleScoreScalarFieldEnum)[keyof typeof ArticleScoreScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    title: 'title',
    content: 'content',
    published: 'published',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    imageUrl: 'imageUrl',
    url: 'url'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const BookScalarFieldEnum: {
    id: 'id',
    title: 'title',
    author: 'author',
    review: 'review',
    rating: 'rating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    imageUrl: 'imageUrl',
    url: 'url'
  };

  export type BookScalarFieldEnum = (typeof BookScalarFieldEnum)[keyof typeof BookScalarFieldEnum]


  export const WishlistItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    url: 'url',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    imageUrl: 'imageUrl'
  };

  export type WishlistItemScalarFieldEnum = (typeof WishlistItemScalarFieldEnum)[keyof typeof WishlistItemScalarFieldEnum]


  export const SongScalarFieldEnum: {
    id: 'id',
    title: 'title',
    audioUrl: 'audioUrl',
    source: 'source',
    duration: 'duration',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SongScalarFieldEnum = (typeof SongScalarFieldEnum)[keyof typeof SongScalarFieldEnum]


  export const PlaylistScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    title: 'title',
    description: 'description',
    philosophy: 'philosophy',
    schedule: 'schedule',
    vibes: 'vibes',
    coverColor: 'coverColor',
    coverImage: 'coverImage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlaylistScalarFieldEnum = (typeof PlaylistScalarFieldEnum)[keyof typeof PlaylistScalarFieldEnum]


  export const PlaylistSongScalarFieldEnum: {
    playlistId: 'playlistId',
    songId: 'songId',
    order: 'order'
  };

  export type PlaylistSongScalarFieldEnum = (typeof PlaylistSongScalarFieldEnum)[keyof typeof PlaylistSongScalarFieldEnum]


  export const MusicAccessLogScalarFieldEnum: {
    id: 'id',
    ip: 'ip',
    city: 'city',
    country: 'country',
    region: 'region',
    isp: 'isp',
    userAgent: 'userAgent',
    songTitle: 'songTitle',
    sessionId: 'sessionId',
    duration: 'duration',
    latitude: 'latitude',
    longitude: 'longitude',
    timezone: 'timezone',
    postal: 'postal',
    timestamp: 'timestamp',
    lastActive: 'lastActive'
  };

  export type MusicAccessLogScalarFieldEnum = (typeof MusicAccessLogScalarFieldEnum)[keyof typeof MusicAccessLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    isRead?: BoolFilter<"Article"> | boolean
    scheduledFor?: DateTimeNullableFilter<"Article"> | Date | string | null
    imageUrl?: StringNullableFilter<"Article"> | string | null
    url?: StringNullableFilter<"Article"> | string | null
    category?: StringNullableFilter<"Article"> | string | null
    isBookmarked?: BoolFilter<"Article"> | boolean
    score?: XOR<ArticleScoreNullableRelationFilter, ArticleScoreWhereInput> | null
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isRead?: SortOrder
    scheduledFor?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    isBookmarked?: SortOrder
    score?: ArticleScoreOrderByWithRelationInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    isRead?: BoolFilter<"Article"> | boolean
    scheduledFor?: DateTimeNullableFilter<"Article"> | Date | string | null
    imageUrl?: StringNullableFilter<"Article"> | string | null
    url?: StringNullableFilter<"Article"> | string | null
    category?: StringNullableFilter<"Article"> | string | null
    isBookmarked?: BoolFilter<"Article"> | boolean
    score?: XOR<ArticleScoreNullableRelationFilter, ArticleScoreWhereInput> | null
  }, "id">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isRead?: SortOrder
    scheduledFor?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    isBookmarked?: SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Article"> | string
    title?: StringWithAggregatesFilter<"Article"> | string
    content?: StringWithAggregatesFilter<"Article"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    isRead?: BoolWithAggregatesFilter<"Article"> | boolean
    scheduledFor?: DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Article"> | string | null
    url?: StringNullableWithAggregatesFilter<"Article"> | string | null
    category?: StringNullableWithAggregatesFilter<"Article"> | string | null
    isBookmarked?: BoolWithAggregatesFilter<"Article"> | boolean
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    articleId?: StringFilter<"Comment"> | string
    authorName?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorName?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    articleId?: StringFilter<"Comment"> | string
    authorName?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorName?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    articleId?: StringWithAggregatesFilter<"Comment"> | string
    authorName?: StringWithAggregatesFilter<"Comment"> | string
    content?: StringWithAggregatesFilter<"Comment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
  }

  export type ArticleScoreWhereInput = {
    AND?: ArticleScoreWhereInput | ArticleScoreWhereInput[]
    OR?: ArticleScoreWhereInput[]
    NOT?: ArticleScoreWhereInput | ArticleScoreWhereInput[]
    id?: StringFilter<"ArticleScore"> | string
    articleId?: StringFilter<"ArticleScore"> | string
    substance?: IntFilter<"ArticleScore"> | number
    depth?: IntFilter<"ArticleScore"> | number
    structure?: IntFilter<"ArticleScore"> | number
    vocabulary?: IntFilter<"ArticleScore"> | number
    readability?: IntFilter<"ArticleScore"> | number
    specificity?: IntFilter<"ArticleScore"> | number
    actionability?: IntFilter<"ArticleScore"> | number
    engagement?: IntFilter<"ArticleScore"> | number
    total?: IntFilter<"ArticleScore"> | number
    updatedAt?: DateTimeFilter<"ArticleScore"> | Date | string
    socialScore?: IntFilter<"ArticleScore"> | number
    article?: XOR<ArticleRelationFilter, ArticleWhereInput>
  }

  export type ArticleScoreOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    updatedAt?: SortOrder
    socialScore?: SortOrder
    article?: ArticleOrderByWithRelationInput
  }

  export type ArticleScoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    articleId?: string
    AND?: ArticleScoreWhereInput | ArticleScoreWhereInput[]
    OR?: ArticleScoreWhereInput[]
    NOT?: ArticleScoreWhereInput | ArticleScoreWhereInput[]
    substance?: IntFilter<"ArticleScore"> | number
    depth?: IntFilter<"ArticleScore"> | number
    structure?: IntFilter<"ArticleScore"> | number
    vocabulary?: IntFilter<"ArticleScore"> | number
    readability?: IntFilter<"ArticleScore"> | number
    specificity?: IntFilter<"ArticleScore"> | number
    actionability?: IntFilter<"ArticleScore"> | number
    engagement?: IntFilter<"ArticleScore"> | number
    total?: IntFilter<"ArticleScore"> | number
    updatedAt?: DateTimeFilter<"ArticleScore"> | Date | string
    socialScore?: IntFilter<"ArticleScore"> | number
    article?: XOR<ArticleRelationFilter, ArticleWhereInput>
  }, "id" | "articleId">

  export type ArticleScoreOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    updatedAt?: SortOrder
    socialScore?: SortOrder
    _count?: ArticleScoreCountOrderByAggregateInput
    _avg?: ArticleScoreAvgOrderByAggregateInput
    _max?: ArticleScoreMaxOrderByAggregateInput
    _min?: ArticleScoreMinOrderByAggregateInput
    _sum?: ArticleScoreSumOrderByAggregateInput
  }

  export type ArticleScoreScalarWhereWithAggregatesInput = {
    AND?: ArticleScoreScalarWhereWithAggregatesInput | ArticleScoreScalarWhereWithAggregatesInput[]
    OR?: ArticleScoreScalarWhereWithAggregatesInput[]
    NOT?: ArticleScoreScalarWhereWithAggregatesInput | ArticleScoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleScore"> | string
    articleId?: StringWithAggregatesFilter<"ArticleScore"> | string
    substance?: IntWithAggregatesFilter<"ArticleScore"> | number
    depth?: IntWithAggregatesFilter<"ArticleScore"> | number
    structure?: IntWithAggregatesFilter<"ArticleScore"> | number
    vocabulary?: IntWithAggregatesFilter<"ArticleScore"> | number
    readability?: IntWithAggregatesFilter<"ArticleScore"> | number
    specificity?: IntWithAggregatesFilter<"ArticleScore"> | number
    actionability?: IntWithAggregatesFilter<"ArticleScore"> | number
    engagement?: IntWithAggregatesFilter<"ArticleScore"> | number
    total?: IntWithAggregatesFilter<"ArticleScore"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"ArticleScore"> | Date | string
    socialScore?: IntWithAggregatesFilter<"ArticleScore"> | number
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: StringFilter<"Post"> | string
    slug?: StringFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    published?: BoolFilter<"Post"> | boolean
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    imageUrl?: StringNullableFilter<"Post"> | string | null
    url?: StringNullableFilter<"Post"> | string | null
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    title?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    published?: BoolFilter<"Post"> | boolean
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    imageUrl?: StringNullableFilter<"Post"> | string | null
    url?: StringNullableFilter<"Post"> | string | null
  }, "id" | "slug">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    _count?: PostCountOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Post"> | string
    slug?: StringWithAggregatesFilter<"Post"> | string
    title?: StringWithAggregatesFilter<"Post"> | string
    content?: StringWithAggregatesFilter<"Post"> | string
    published?: BoolWithAggregatesFilter<"Post"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"Post"> | string | null
    url?: StringNullableWithAggregatesFilter<"Post"> | string | null
  }

  export type BookWhereInput = {
    AND?: BookWhereInput | BookWhereInput[]
    OR?: BookWhereInput[]
    NOT?: BookWhereInput | BookWhereInput[]
    id?: StringFilter<"Book"> | string
    title?: StringFilter<"Book"> | string
    author?: StringFilter<"Book"> | string
    review?: StringNullableFilter<"Book"> | string | null
    rating?: IntFilter<"Book"> | number
    createdAt?: DateTimeFilter<"Book"> | Date | string
    updatedAt?: DateTimeFilter<"Book"> | Date | string
    imageUrl?: StringNullableFilter<"Book"> | string | null
    url?: StringNullableFilter<"Book"> | string | null
  }

  export type BookOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    review?: SortOrderInput | SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
  }

  export type BookWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookWhereInput | BookWhereInput[]
    OR?: BookWhereInput[]
    NOT?: BookWhereInput | BookWhereInput[]
    title?: StringFilter<"Book"> | string
    author?: StringFilter<"Book"> | string
    review?: StringNullableFilter<"Book"> | string | null
    rating?: IntFilter<"Book"> | number
    createdAt?: DateTimeFilter<"Book"> | Date | string
    updatedAt?: DateTimeFilter<"Book"> | Date | string
    imageUrl?: StringNullableFilter<"Book"> | string | null
    url?: StringNullableFilter<"Book"> | string | null
  }, "id">

  export type BookOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    review?: SortOrderInput | SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    _count?: BookCountOrderByAggregateInput
    _avg?: BookAvgOrderByAggregateInput
    _max?: BookMaxOrderByAggregateInput
    _min?: BookMinOrderByAggregateInput
    _sum?: BookSumOrderByAggregateInput
  }

  export type BookScalarWhereWithAggregatesInput = {
    AND?: BookScalarWhereWithAggregatesInput | BookScalarWhereWithAggregatesInput[]
    OR?: BookScalarWhereWithAggregatesInput[]
    NOT?: BookScalarWhereWithAggregatesInput | BookScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Book"> | string
    title?: StringWithAggregatesFilter<"Book"> | string
    author?: StringWithAggregatesFilter<"Book"> | string
    review?: StringNullableWithAggregatesFilter<"Book"> | string | null
    rating?: IntWithAggregatesFilter<"Book"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Book"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Book"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"Book"> | string | null
    url?: StringNullableWithAggregatesFilter<"Book"> | string | null
  }

  export type WishlistItemWhereInput = {
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[]
    OR?: WishlistItemWhereInput[]
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[]
    id?: StringFilter<"WishlistItem"> | string
    name?: StringFilter<"WishlistItem"> | string
    price?: StringNullableFilter<"WishlistItem"> | string | null
    url?: StringNullableFilter<"WishlistItem"> | string | null
    priority?: StringFilter<"WishlistItem"> | string
    createdAt?: DateTimeFilter<"WishlistItem"> | Date | string
    updatedAt?: DateTimeFilter<"WishlistItem"> | Date | string
    imageUrl?: StringNullableFilter<"WishlistItem"> | string | null
  }

  export type WishlistItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
  }

  export type WishlistItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[]
    OR?: WishlistItemWhereInput[]
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[]
    name?: StringFilter<"WishlistItem"> | string
    price?: StringNullableFilter<"WishlistItem"> | string | null
    url?: StringNullableFilter<"WishlistItem"> | string | null
    priority?: StringFilter<"WishlistItem"> | string
    createdAt?: DateTimeFilter<"WishlistItem"> | Date | string
    updatedAt?: DateTimeFilter<"WishlistItem"> | Date | string
    imageUrl?: StringNullableFilter<"WishlistItem"> | string | null
  }, "id">

  export type WishlistItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: WishlistItemCountOrderByAggregateInput
    _max?: WishlistItemMaxOrderByAggregateInput
    _min?: WishlistItemMinOrderByAggregateInput
  }

  export type WishlistItemScalarWhereWithAggregatesInput = {
    AND?: WishlistItemScalarWhereWithAggregatesInput | WishlistItemScalarWhereWithAggregatesInput[]
    OR?: WishlistItemScalarWhereWithAggregatesInput[]
    NOT?: WishlistItemScalarWhereWithAggregatesInput | WishlistItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WishlistItem"> | string
    name?: StringWithAggregatesFilter<"WishlistItem"> | string
    price?: StringNullableWithAggregatesFilter<"WishlistItem"> | string | null
    url?: StringNullableWithAggregatesFilter<"WishlistItem"> | string | null
    priority?: StringWithAggregatesFilter<"WishlistItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WishlistItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WishlistItem"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"WishlistItem"> | string | null
  }

  export type SongWhereInput = {
    AND?: SongWhereInput | SongWhereInput[]
    OR?: SongWhereInput[]
    NOT?: SongWhereInput | SongWhereInput[]
    id?: StringFilter<"Song"> | string
    title?: StringFilter<"Song"> | string
    audioUrl?: StringFilter<"Song"> | string
    source?: StringFilter<"Song"> | string
    duration?: IntNullableFilter<"Song"> | number | null
    createdAt?: DateTimeFilter<"Song"> | Date | string
    updatedAt?: DateTimeFilter<"Song"> | Date | string
    playlists?: PlaylistSongListRelationFilter
  }

  export type SongOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    audioUrl?: SortOrder
    source?: SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    playlists?: PlaylistSongOrderByRelationAggregateInput
  }

  export type SongWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SongWhereInput | SongWhereInput[]
    OR?: SongWhereInput[]
    NOT?: SongWhereInput | SongWhereInput[]
    title?: StringFilter<"Song"> | string
    audioUrl?: StringFilter<"Song"> | string
    source?: StringFilter<"Song"> | string
    duration?: IntNullableFilter<"Song"> | number | null
    createdAt?: DateTimeFilter<"Song"> | Date | string
    updatedAt?: DateTimeFilter<"Song"> | Date | string
    playlists?: PlaylistSongListRelationFilter
  }, "id">

  export type SongOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    audioUrl?: SortOrder
    source?: SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SongCountOrderByAggregateInput
    _avg?: SongAvgOrderByAggregateInput
    _max?: SongMaxOrderByAggregateInput
    _min?: SongMinOrderByAggregateInput
    _sum?: SongSumOrderByAggregateInput
  }

  export type SongScalarWhereWithAggregatesInput = {
    AND?: SongScalarWhereWithAggregatesInput | SongScalarWhereWithAggregatesInput[]
    OR?: SongScalarWhereWithAggregatesInput[]
    NOT?: SongScalarWhereWithAggregatesInput | SongScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Song"> | string
    title?: StringWithAggregatesFilter<"Song"> | string
    audioUrl?: StringWithAggregatesFilter<"Song"> | string
    source?: StringWithAggregatesFilter<"Song"> | string
    duration?: IntNullableWithAggregatesFilter<"Song"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Song"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Song"> | Date | string
  }

  export type PlaylistWhereInput = {
    AND?: PlaylistWhereInput | PlaylistWhereInput[]
    OR?: PlaylistWhereInput[]
    NOT?: PlaylistWhereInput | PlaylistWhereInput[]
    id?: StringFilter<"Playlist"> | string
    slug?: StringFilter<"Playlist"> | string
    title?: StringFilter<"Playlist"> | string
    description?: StringNullableFilter<"Playlist"> | string | null
    philosophy?: StringNullableFilter<"Playlist"> | string | null
    schedule?: StringNullableFilter<"Playlist"> | string | null
    vibes?: StringNullableListFilter<"Playlist">
    coverColor?: StringNullableFilter<"Playlist"> | string | null
    coverImage?: StringNullableFilter<"Playlist"> | string | null
    createdAt?: DateTimeFilter<"Playlist"> | Date | string
    updatedAt?: DateTimeFilter<"Playlist"> | Date | string
    songs?: PlaylistSongListRelationFilter
  }

  export type PlaylistOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    philosophy?: SortOrderInput | SortOrder
    schedule?: SortOrderInput | SortOrder
    vibes?: SortOrder
    coverColor?: SortOrderInput | SortOrder
    coverImage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    songs?: PlaylistSongOrderByRelationAggregateInput
  }

  export type PlaylistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: PlaylistWhereInput | PlaylistWhereInput[]
    OR?: PlaylistWhereInput[]
    NOT?: PlaylistWhereInput | PlaylistWhereInput[]
    title?: StringFilter<"Playlist"> | string
    description?: StringNullableFilter<"Playlist"> | string | null
    philosophy?: StringNullableFilter<"Playlist"> | string | null
    schedule?: StringNullableFilter<"Playlist"> | string | null
    vibes?: StringNullableListFilter<"Playlist">
    coverColor?: StringNullableFilter<"Playlist"> | string | null
    coverImage?: StringNullableFilter<"Playlist"> | string | null
    createdAt?: DateTimeFilter<"Playlist"> | Date | string
    updatedAt?: DateTimeFilter<"Playlist"> | Date | string
    songs?: PlaylistSongListRelationFilter
  }, "id" | "slug">

  export type PlaylistOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    philosophy?: SortOrderInput | SortOrder
    schedule?: SortOrderInput | SortOrder
    vibes?: SortOrder
    coverColor?: SortOrderInput | SortOrder
    coverImage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlaylistCountOrderByAggregateInput
    _max?: PlaylistMaxOrderByAggregateInput
    _min?: PlaylistMinOrderByAggregateInput
  }

  export type PlaylistScalarWhereWithAggregatesInput = {
    AND?: PlaylistScalarWhereWithAggregatesInput | PlaylistScalarWhereWithAggregatesInput[]
    OR?: PlaylistScalarWhereWithAggregatesInput[]
    NOT?: PlaylistScalarWhereWithAggregatesInput | PlaylistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Playlist"> | string
    slug?: StringWithAggregatesFilter<"Playlist"> | string
    title?: StringWithAggregatesFilter<"Playlist"> | string
    description?: StringNullableWithAggregatesFilter<"Playlist"> | string | null
    philosophy?: StringNullableWithAggregatesFilter<"Playlist"> | string | null
    schedule?: StringNullableWithAggregatesFilter<"Playlist"> | string | null
    vibes?: StringNullableListFilter<"Playlist">
    coverColor?: StringNullableWithAggregatesFilter<"Playlist"> | string | null
    coverImage?: StringNullableWithAggregatesFilter<"Playlist"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Playlist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Playlist"> | Date | string
  }

  export type PlaylistSongWhereInput = {
    AND?: PlaylistSongWhereInput | PlaylistSongWhereInput[]
    OR?: PlaylistSongWhereInput[]
    NOT?: PlaylistSongWhereInput | PlaylistSongWhereInput[]
    playlistId?: StringFilter<"PlaylistSong"> | string
    songId?: StringFilter<"PlaylistSong"> | string
    order?: IntFilter<"PlaylistSong"> | number
    playlist?: XOR<PlaylistRelationFilter, PlaylistWhereInput>
    song?: XOR<SongRelationFilter, SongWhereInput>
  }

  export type PlaylistSongOrderByWithRelationInput = {
    playlistId?: SortOrder
    songId?: SortOrder
    order?: SortOrder
    playlist?: PlaylistOrderByWithRelationInput
    song?: SongOrderByWithRelationInput
  }

  export type PlaylistSongWhereUniqueInput = Prisma.AtLeast<{
    playlistId_songId?: PlaylistSongPlaylistIdSongIdCompoundUniqueInput
    AND?: PlaylistSongWhereInput | PlaylistSongWhereInput[]
    OR?: PlaylistSongWhereInput[]
    NOT?: PlaylistSongWhereInput | PlaylistSongWhereInput[]
    playlistId?: StringFilter<"PlaylistSong"> | string
    songId?: StringFilter<"PlaylistSong"> | string
    order?: IntFilter<"PlaylistSong"> | number
    playlist?: XOR<PlaylistRelationFilter, PlaylistWhereInput>
    song?: XOR<SongRelationFilter, SongWhereInput>
  }, "playlistId_songId">

  export type PlaylistSongOrderByWithAggregationInput = {
    playlistId?: SortOrder
    songId?: SortOrder
    order?: SortOrder
    _count?: PlaylistSongCountOrderByAggregateInput
    _avg?: PlaylistSongAvgOrderByAggregateInput
    _max?: PlaylistSongMaxOrderByAggregateInput
    _min?: PlaylistSongMinOrderByAggregateInput
    _sum?: PlaylistSongSumOrderByAggregateInput
  }

  export type PlaylistSongScalarWhereWithAggregatesInput = {
    AND?: PlaylistSongScalarWhereWithAggregatesInput | PlaylistSongScalarWhereWithAggregatesInput[]
    OR?: PlaylistSongScalarWhereWithAggregatesInput[]
    NOT?: PlaylistSongScalarWhereWithAggregatesInput | PlaylistSongScalarWhereWithAggregatesInput[]
    playlistId?: StringWithAggregatesFilter<"PlaylistSong"> | string
    songId?: StringWithAggregatesFilter<"PlaylistSong"> | string
    order?: IntWithAggregatesFilter<"PlaylistSong"> | number
  }

  export type MusicAccessLogWhereInput = {
    AND?: MusicAccessLogWhereInput | MusicAccessLogWhereInput[]
    OR?: MusicAccessLogWhereInput[]
    NOT?: MusicAccessLogWhereInput | MusicAccessLogWhereInput[]
    id?: StringFilter<"MusicAccessLog"> | string
    ip?: StringFilter<"MusicAccessLog"> | string
    city?: StringNullableFilter<"MusicAccessLog"> | string | null
    country?: StringNullableFilter<"MusicAccessLog"> | string | null
    region?: StringNullableFilter<"MusicAccessLog"> | string | null
    isp?: StringNullableFilter<"MusicAccessLog"> | string | null
    userAgent?: StringNullableFilter<"MusicAccessLog"> | string | null
    songTitle?: StringNullableFilter<"MusicAccessLog"> | string | null
    sessionId?: StringNullableFilter<"MusicAccessLog"> | string | null
    duration?: IntFilter<"MusicAccessLog"> | number
    latitude?: FloatNullableFilter<"MusicAccessLog"> | number | null
    longitude?: FloatNullableFilter<"MusicAccessLog"> | number | null
    timezone?: StringNullableFilter<"MusicAccessLog"> | string | null
    postal?: StringNullableFilter<"MusicAccessLog"> | string | null
    timestamp?: DateTimeFilter<"MusicAccessLog"> | Date | string
    lastActive?: DateTimeFilter<"MusicAccessLog"> | Date | string
  }

  export type MusicAccessLogOrderByWithRelationInput = {
    id?: SortOrder
    ip?: SortOrder
    city?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    isp?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    songTitle?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    duration?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    timezone?: SortOrderInput | SortOrder
    postal?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    lastActive?: SortOrder
  }

  export type MusicAccessLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MusicAccessLogWhereInput | MusicAccessLogWhereInput[]
    OR?: MusicAccessLogWhereInput[]
    NOT?: MusicAccessLogWhereInput | MusicAccessLogWhereInput[]
    ip?: StringFilter<"MusicAccessLog"> | string
    city?: StringNullableFilter<"MusicAccessLog"> | string | null
    country?: StringNullableFilter<"MusicAccessLog"> | string | null
    region?: StringNullableFilter<"MusicAccessLog"> | string | null
    isp?: StringNullableFilter<"MusicAccessLog"> | string | null
    userAgent?: StringNullableFilter<"MusicAccessLog"> | string | null
    songTitle?: StringNullableFilter<"MusicAccessLog"> | string | null
    sessionId?: StringNullableFilter<"MusicAccessLog"> | string | null
    duration?: IntFilter<"MusicAccessLog"> | number
    latitude?: FloatNullableFilter<"MusicAccessLog"> | number | null
    longitude?: FloatNullableFilter<"MusicAccessLog"> | number | null
    timezone?: StringNullableFilter<"MusicAccessLog"> | string | null
    postal?: StringNullableFilter<"MusicAccessLog"> | string | null
    timestamp?: DateTimeFilter<"MusicAccessLog"> | Date | string
    lastActive?: DateTimeFilter<"MusicAccessLog"> | Date | string
  }, "id">

  export type MusicAccessLogOrderByWithAggregationInput = {
    id?: SortOrder
    ip?: SortOrder
    city?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    isp?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    songTitle?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    duration?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    timezone?: SortOrderInput | SortOrder
    postal?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    lastActive?: SortOrder
    _count?: MusicAccessLogCountOrderByAggregateInput
    _avg?: MusicAccessLogAvgOrderByAggregateInput
    _max?: MusicAccessLogMaxOrderByAggregateInput
    _min?: MusicAccessLogMinOrderByAggregateInput
    _sum?: MusicAccessLogSumOrderByAggregateInput
  }

  export type MusicAccessLogScalarWhereWithAggregatesInput = {
    AND?: MusicAccessLogScalarWhereWithAggregatesInput | MusicAccessLogScalarWhereWithAggregatesInput[]
    OR?: MusicAccessLogScalarWhereWithAggregatesInput[]
    NOT?: MusicAccessLogScalarWhereWithAggregatesInput | MusicAccessLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MusicAccessLog"> | string
    ip?: StringWithAggregatesFilter<"MusicAccessLog"> | string
    city?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    country?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    region?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    isp?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    songTitle?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    sessionId?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    duration?: IntWithAggregatesFilter<"MusicAccessLog"> | number
    latitude?: FloatNullableWithAggregatesFilter<"MusicAccessLog"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"MusicAccessLog"> | number | null
    timezone?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    postal?: StringNullableWithAggregatesFilter<"MusicAccessLog"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"MusicAccessLog"> | Date | string
    lastActive?: DateTimeWithAggregatesFilter<"MusicAccessLog"> | Date | string
  }

  export type ArticleCreateInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isRead?: boolean
    scheduledFor?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    category?: string | null
    isBookmarked?: boolean
    score?: ArticleScoreCreateNestedOneWithoutArticleInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isRead?: boolean
    scheduledFor?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    category?: string | null
    isBookmarked?: boolean
    score?: ArticleScoreUncheckedCreateNestedOneWithoutArticleInput
  }

  export type ArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isBookmarked?: BoolFieldUpdateOperationsInput | boolean
    score?: ArticleScoreUpdateOneWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isBookmarked?: BoolFieldUpdateOperationsInput | boolean
    score?: ArticleScoreUncheckedUpdateOneWithoutArticleNestedInput
  }

  export type ArticleCreateManyInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isRead?: boolean
    scheduledFor?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    category?: string | null
    isBookmarked?: boolean
  }

  export type ArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isBookmarked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isBookmarked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CommentCreateInput = {
    id?: string
    articleId: string
    authorName?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    articleId: string
    authorName?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyInput = {
    id?: string
    articleId: string
    authorName?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleScoreCreateInput = {
    id?: string
    substance?: number
    depth?: number
    structure?: number
    vocabulary?: number
    readability?: number
    specificity?: number
    actionability?: number
    engagement?: number
    total?: number
    updatedAt?: Date | string
    socialScore?: number
    article: ArticleCreateNestedOneWithoutScoreInput
  }

  export type ArticleScoreUncheckedCreateInput = {
    id?: string
    articleId: string
    substance?: number
    depth?: number
    structure?: number
    vocabulary?: number
    readability?: number
    specificity?: number
    actionability?: number
    engagement?: number
    total?: number
    updatedAt?: Date | string
    socialScore?: number
  }

  export type ArticleScoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: IntFieldUpdateOperationsInput | number
    depth?: IntFieldUpdateOperationsInput | number
    structure?: IntFieldUpdateOperationsInput | number
    vocabulary?: IntFieldUpdateOperationsInput | number
    readability?: IntFieldUpdateOperationsInput | number
    specificity?: IntFieldUpdateOperationsInput | number
    actionability?: IntFieldUpdateOperationsInput | number
    engagement?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    socialScore?: IntFieldUpdateOperationsInput | number
    article?: ArticleUpdateOneRequiredWithoutScoreNestedInput
  }

  export type ArticleScoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    substance?: IntFieldUpdateOperationsInput | number
    depth?: IntFieldUpdateOperationsInput | number
    structure?: IntFieldUpdateOperationsInput | number
    vocabulary?: IntFieldUpdateOperationsInput | number
    readability?: IntFieldUpdateOperationsInput | number
    specificity?: IntFieldUpdateOperationsInput | number
    actionability?: IntFieldUpdateOperationsInput | number
    engagement?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    socialScore?: IntFieldUpdateOperationsInput | number
  }

  export type ArticleScoreCreateManyInput = {
    id?: string
    articleId: string
    substance?: number
    depth?: number
    structure?: number
    vocabulary?: number
    readability?: number
    specificity?: number
    actionability?: number
    engagement?: number
    total?: number
    updatedAt?: Date | string
    socialScore?: number
  }

  export type ArticleScoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: IntFieldUpdateOperationsInput | number
    depth?: IntFieldUpdateOperationsInput | number
    structure?: IntFieldUpdateOperationsInput | number
    vocabulary?: IntFieldUpdateOperationsInput | number
    readability?: IntFieldUpdateOperationsInput | number
    specificity?: IntFieldUpdateOperationsInput | number
    actionability?: IntFieldUpdateOperationsInput | number
    engagement?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    socialScore?: IntFieldUpdateOperationsInput | number
  }

  export type ArticleScoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    substance?: IntFieldUpdateOperationsInput | number
    depth?: IntFieldUpdateOperationsInput | number
    structure?: IntFieldUpdateOperationsInput | number
    vocabulary?: IntFieldUpdateOperationsInput | number
    readability?: IntFieldUpdateOperationsInput | number
    specificity?: IntFieldUpdateOperationsInput | number
    actionability?: IntFieldUpdateOperationsInput | number
    engagement?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    socialScore?: IntFieldUpdateOperationsInput | number
  }

  export type PostCreateInput = {
    id?: string
    slug: string
    title: string
    content: string
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
    url?: string | null
  }

  export type PostUncheckedCreateInput = {
    id?: string
    slug: string
    title: string
    content: string
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
    url?: string | null
  }

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostCreateManyInput = {
    id?: string
    slug: string
    title: string
    content: string
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
    url?: string | null
  }

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookCreateInput = {
    id?: string
    title: string
    author: string
    review?: string | null
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
    url?: string | null
  }

  export type BookUncheckedCreateInput = {
    id?: string
    title: string
    author: string
    review?: string | null
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
    url?: string | null
  }

  export type BookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    review?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    review?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookCreateManyInput = {
    id?: string
    title: string
    author: string
    review?: string | null
    rating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
    url?: string | null
  }

  export type BookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    review?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    review?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistItemCreateInput = {
    id?: string
    name: string
    price?: string | null
    url?: string | null
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
  }

  export type WishlistItemUncheckedCreateInput = {
    id?: string
    name: string
    price?: string | null
    url?: string | null
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
  }

  export type WishlistItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistItemCreateManyInput = {
    id?: string
    name: string
    price?: string | null
    url?: string | null
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    imageUrl?: string | null
  }

  export type WishlistItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SongCreateInput = {
    id?: string
    title: string
    audioUrl: string
    source?: string
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    playlists?: PlaylistSongCreateNestedManyWithoutSongInput
  }

  export type SongUncheckedCreateInput = {
    id?: string
    title: string
    audioUrl: string
    source?: string
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    playlists?: PlaylistSongUncheckedCreateNestedManyWithoutSongInput
  }

  export type SongUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    audioUrl?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    playlists?: PlaylistSongUpdateManyWithoutSongNestedInput
  }

  export type SongUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    audioUrl?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    playlists?: PlaylistSongUncheckedUpdateManyWithoutSongNestedInput
  }

  export type SongCreateManyInput = {
    id?: string
    title: string
    audioUrl: string
    source?: string
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SongUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    audioUrl?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SongUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    audioUrl?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaylistCreateInput = {
    id?: string
    slug: string
    title: string
    description?: string | null
    philosophy?: string | null
    schedule?: string | null
    vibes?: PlaylistCreatevibesInput | string[]
    coverColor?: string | null
    coverImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    songs?: PlaylistSongCreateNestedManyWithoutPlaylistInput
  }

  export type PlaylistUncheckedCreateInput = {
    id?: string
    slug: string
    title: string
    description?: string | null
    philosophy?: string | null
    schedule?: string | null
    vibes?: PlaylistCreatevibesInput | string[]
    coverColor?: string | null
    coverImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    songs?: PlaylistSongUncheckedCreateNestedManyWithoutPlaylistInput
  }

  export type PlaylistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    philosophy?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    vibes?: PlaylistUpdatevibesInput | string[]
    coverColor?: NullableStringFieldUpdateOperationsInput | string | null
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    songs?: PlaylistSongUpdateManyWithoutPlaylistNestedInput
  }

  export type PlaylistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    philosophy?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    vibes?: PlaylistUpdatevibesInput | string[]
    coverColor?: NullableStringFieldUpdateOperationsInput | string | null
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    songs?: PlaylistSongUncheckedUpdateManyWithoutPlaylistNestedInput
  }

  export type PlaylistCreateManyInput = {
    id?: string
    slug: string
    title: string
    description?: string | null
    philosophy?: string | null
    schedule?: string | null
    vibes?: PlaylistCreatevibesInput | string[]
    coverColor?: string | null
    coverImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaylistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    philosophy?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    vibes?: PlaylistUpdatevibesInput | string[]
    coverColor?: NullableStringFieldUpdateOperationsInput | string | null
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaylistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    philosophy?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    vibes?: PlaylistUpdatevibesInput | string[]
    coverColor?: NullableStringFieldUpdateOperationsInput | string | null
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaylistSongCreateInput = {
    order?: number
    playlist: PlaylistCreateNestedOneWithoutSongsInput
    song: SongCreateNestedOneWithoutPlaylistsInput
  }

  export type PlaylistSongUncheckedCreateInput = {
    playlistId: string
    songId: string
    order?: number
  }

  export type PlaylistSongUpdateInput = {
    order?: IntFieldUpdateOperationsInput | number
    playlist?: PlaylistUpdateOneRequiredWithoutSongsNestedInput
    song?: SongUpdateOneRequiredWithoutPlaylistsNestedInput
  }

  export type PlaylistSongUncheckedUpdateInput = {
    playlistId?: StringFieldUpdateOperationsInput | string
    songId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PlaylistSongCreateManyInput = {
    playlistId: string
    songId: string
    order?: number
  }

  export type PlaylistSongUpdateManyMutationInput = {
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PlaylistSongUncheckedUpdateManyInput = {
    playlistId?: StringFieldUpdateOperationsInput | string
    songId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type MusicAccessLogCreateInput = {
    id?: string
    ip: string
    city?: string | null
    country?: string | null
    region?: string | null
    isp?: string | null
    userAgent?: string | null
    songTitle?: string | null
    sessionId?: string | null
    duration?: number
    latitude?: number | null
    longitude?: number | null
    timezone?: string | null
    postal?: string | null
    timestamp?: Date | string
    lastActive?: Date | string
  }

  export type MusicAccessLogUncheckedCreateInput = {
    id?: string
    ip: string
    city?: string | null
    country?: string | null
    region?: string | null
    isp?: string | null
    userAgent?: string | null
    songTitle?: string | null
    sessionId?: string | null
    duration?: number
    latitude?: number | null
    longitude?: number | null
    timezone?: string | null
    postal?: string | null
    timestamp?: Date | string
    lastActive?: Date | string
  }

  export type MusicAccessLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    isp?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    songTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicAccessLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    isp?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    songTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicAccessLogCreateManyInput = {
    id?: string
    ip: string
    city?: string | null
    country?: string | null
    region?: string | null
    isp?: string | null
    userAgent?: string | null
    songTitle?: string | null
    sessionId?: string | null
    duration?: number
    latitude?: number | null
    longitude?: number | null
    timezone?: string | null
    postal?: string | null
    timestamp?: Date | string
    lastActive?: Date | string
  }

  export type MusicAccessLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    isp?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    songTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicAccessLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    isp?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    songTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type ArticleScoreNullableRelationFilter = {
    is?: ArticleScoreWhereInput | null
    isNot?: ArticleScoreWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isRead?: SortOrder
    scheduledFor?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
    category?: SortOrder
    isBookmarked?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isRead?: SortOrder
    scheduledFor?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
    category?: SortOrder
    isBookmarked?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isRead?: SortOrder
    scheduledFor?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
    category?: SortOrder
    isBookmarked?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorName?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorName?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorName?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ArticleRelationFilter = {
    is?: ArticleWhereInput
    isNot?: ArticleWhereInput
  }

  export type ArticleScoreCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    updatedAt?: SortOrder
    socialScore?: SortOrder
  }

  export type ArticleScoreAvgOrderByAggregateInput = {
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    socialScore?: SortOrder
  }

  export type ArticleScoreMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    updatedAt?: SortOrder
    socialScore?: SortOrder
  }

  export type ArticleScoreMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    updatedAt?: SortOrder
    socialScore?: SortOrder
  }

  export type ArticleScoreSumOrderByAggregateInput = {
    substance?: SortOrder
    depth?: SortOrder
    structure?: SortOrder
    vocabulary?: SortOrder
    readability?: SortOrder
    specificity?: SortOrder
    actionability?: SortOrder
    engagement?: SortOrder
    total?: SortOrder
    socialScore?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
  }

  export type BookCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    review?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
  }

  export type BookAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type BookMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    review?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
  }

  export type BookMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    review?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
    url?: SortOrder
  }

  export type BookSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type WishlistItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    url?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type WishlistItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    url?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type WishlistItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    url?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type PlaylistSongListRelationFilter = {
    every?: PlaylistSongWhereInput
    some?: PlaylistSongWhereInput
    none?: PlaylistSongWhereInput
  }

  export type PlaylistSongOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SongCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    audioUrl?: SortOrder
    source?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SongAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type SongMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    audioUrl?: SortOrder
    source?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SongMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    audioUrl?: SortOrder
    source?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SongSumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type PlaylistCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    philosophy?: SortOrder
    schedule?: SortOrder
    vibes?: SortOrder
    coverColor?: SortOrder
    coverImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlaylistMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    philosophy?: SortOrder
    schedule?: SortOrder
    coverColor?: SortOrder
    coverImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlaylistMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    philosophy?: SortOrder
    schedule?: SortOrder
    coverColor?: SortOrder
    coverImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlaylistRelationFilter = {
    is?: PlaylistWhereInput
    isNot?: PlaylistWhereInput
  }

  export type SongRelationFilter = {
    is?: SongWhereInput
    isNot?: SongWhereInput
  }

  export type PlaylistSongPlaylistIdSongIdCompoundUniqueInput = {
    playlistId: string
    songId: string
  }

  export type PlaylistSongCountOrderByAggregateInput = {
    playlistId?: SortOrder
    songId?: SortOrder
    order?: SortOrder
  }

  export type PlaylistSongAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type PlaylistSongMaxOrderByAggregateInput = {
    playlistId?: SortOrder
    songId?: SortOrder
    order?: SortOrder
  }

  export type PlaylistSongMinOrderByAggregateInput = {
    playlistId?: SortOrder
    songId?: SortOrder
    order?: SortOrder
  }

  export type PlaylistSongSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type MusicAccessLogCountOrderByAggregateInput = {
    id?: SortOrder
    ip?: SortOrder
    city?: SortOrder
    country?: SortOrder
    region?: SortOrder
    isp?: SortOrder
    userAgent?: SortOrder
    songTitle?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    timezone?: SortOrder
    postal?: SortOrder
    timestamp?: SortOrder
    lastActive?: SortOrder
  }

  export type MusicAccessLogAvgOrderByAggregateInput = {
    duration?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type MusicAccessLogMaxOrderByAggregateInput = {
    id?: SortOrder
    ip?: SortOrder
    city?: SortOrder
    country?: SortOrder
    region?: SortOrder
    isp?: SortOrder
    userAgent?: SortOrder
    songTitle?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    timezone?: SortOrder
    postal?: SortOrder
    timestamp?: SortOrder
    lastActive?: SortOrder
  }

  export type MusicAccessLogMinOrderByAggregateInput = {
    id?: SortOrder
    ip?: SortOrder
    city?: SortOrder
    country?: SortOrder
    region?: SortOrder
    isp?: SortOrder
    userAgent?: SortOrder
    songTitle?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    timezone?: SortOrder
    postal?: SortOrder
    timestamp?: SortOrder
    lastActive?: SortOrder
  }

  export type MusicAccessLogSumOrderByAggregateInput = {
    duration?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ArticleScoreCreateNestedOneWithoutArticleInput = {
    create?: XOR<ArticleScoreCreateWithoutArticleInput, ArticleScoreUncheckedCreateWithoutArticleInput>
    connectOrCreate?: ArticleScoreCreateOrConnectWithoutArticleInput
    connect?: ArticleScoreWhereUniqueInput
  }

  export type ArticleScoreUncheckedCreateNestedOneWithoutArticleInput = {
    create?: XOR<ArticleScoreCreateWithoutArticleInput, ArticleScoreUncheckedCreateWithoutArticleInput>
    connectOrCreate?: ArticleScoreCreateOrConnectWithoutArticleInput
    connect?: ArticleScoreWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ArticleScoreUpdateOneWithoutArticleNestedInput = {
    create?: XOR<ArticleScoreCreateWithoutArticleInput, ArticleScoreUncheckedCreateWithoutArticleInput>
    connectOrCreate?: ArticleScoreCreateOrConnectWithoutArticleInput
    upsert?: ArticleScoreUpsertWithoutArticleInput
    disconnect?: ArticleScoreWhereInput | boolean
    delete?: ArticleScoreWhereInput | boolean
    connect?: ArticleScoreWhereUniqueInput
    update?: XOR<XOR<ArticleScoreUpdateToOneWithWhereWithoutArticleInput, ArticleScoreUpdateWithoutArticleInput>, ArticleScoreUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleScoreUncheckedUpdateOneWithoutArticleNestedInput = {
    create?: XOR<ArticleScoreCreateWithoutArticleInput, ArticleScoreUncheckedCreateWithoutArticleInput>
    connectOrCreate?: ArticleScoreCreateOrConnectWithoutArticleInput
    upsert?: ArticleScoreUpsertWithoutArticleInput
    disconnect?: ArticleScoreWhereInput | boolean
    delete?: ArticleScoreWhereInput | boolean
    connect?: ArticleScoreWhereUniqueInput
    update?: XOR<XOR<ArticleScoreUpdateToOneWithWhereWithoutArticleInput, ArticleScoreUpdateWithoutArticleInput>, ArticleScoreUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleCreateNestedOneWithoutScoreInput = {
    create?: XOR<ArticleCreateWithoutScoreInput, ArticleUncheckedCreateWithoutScoreInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutScoreInput
    connect?: ArticleWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ArticleUpdateOneRequiredWithoutScoreNestedInput = {
    create?: XOR<ArticleCreateWithoutScoreInput, ArticleUncheckedCreateWithoutScoreInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutScoreInput
    upsert?: ArticleUpsertWithoutScoreInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutScoreInput, ArticleUpdateWithoutScoreInput>, ArticleUncheckedUpdateWithoutScoreInput>
  }

  export type PlaylistSongCreateNestedManyWithoutSongInput = {
    create?: XOR<PlaylistSongCreateWithoutSongInput, PlaylistSongUncheckedCreateWithoutSongInput> | PlaylistSongCreateWithoutSongInput[] | PlaylistSongUncheckedCreateWithoutSongInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutSongInput | PlaylistSongCreateOrConnectWithoutSongInput[]
    createMany?: PlaylistSongCreateManySongInputEnvelope
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
  }

  export type PlaylistSongUncheckedCreateNestedManyWithoutSongInput = {
    create?: XOR<PlaylistSongCreateWithoutSongInput, PlaylistSongUncheckedCreateWithoutSongInput> | PlaylistSongCreateWithoutSongInput[] | PlaylistSongUncheckedCreateWithoutSongInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutSongInput | PlaylistSongCreateOrConnectWithoutSongInput[]
    createMany?: PlaylistSongCreateManySongInputEnvelope
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PlaylistSongUpdateManyWithoutSongNestedInput = {
    create?: XOR<PlaylistSongCreateWithoutSongInput, PlaylistSongUncheckedCreateWithoutSongInput> | PlaylistSongCreateWithoutSongInput[] | PlaylistSongUncheckedCreateWithoutSongInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutSongInput | PlaylistSongCreateOrConnectWithoutSongInput[]
    upsert?: PlaylistSongUpsertWithWhereUniqueWithoutSongInput | PlaylistSongUpsertWithWhereUniqueWithoutSongInput[]
    createMany?: PlaylistSongCreateManySongInputEnvelope
    set?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    disconnect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    delete?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    update?: PlaylistSongUpdateWithWhereUniqueWithoutSongInput | PlaylistSongUpdateWithWhereUniqueWithoutSongInput[]
    updateMany?: PlaylistSongUpdateManyWithWhereWithoutSongInput | PlaylistSongUpdateManyWithWhereWithoutSongInput[]
    deleteMany?: PlaylistSongScalarWhereInput | PlaylistSongScalarWhereInput[]
  }

  export type PlaylistSongUncheckedUpdateManyWithoutSongNestedInput = {
    create?: XOR<PlaylistSongCreateWithoutSongInput, PlaylistSongUncheckedCreateWithoutSongInput> | PlaylistSongCreateWithoutSongInput[] | PlaylistSongUncheckedCreateWithoutSongInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutSongInput | PlaylistSongCreateOrConnectWithoutSongInput[]
    upsert?: PlaylistSongUpsertWithWhereUniqueWithoutSongInput | PlaylistSongUpsertWithWhereUniqueWithoutSongInput[]
    createMany?: PlaylistSongCreateManySongInputEnvelope
    set?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    disconnect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    delete?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    update?: PlaylistSongUpdateWithWhereUniqueWithoutSongInput | PlaylistSongUpdateWithWhereUniqueWithoutSongInput[]
    updateMany?: PlaylistSongUpdateManyWithWhereWithoutSongInput | PlaylistSongUpdateManyWithWhereWithoutSongInput[]
    deleteMany?: PlaylistSongScalarWhereInput | PlaylistSongScalarWhereInput[]
  }

  export type PlaylistCreatevibesInput = {
    set: string[]
  }

  export type PlaylistSongCreateNestedManyWithoutPlaylistInput = {
    create?: XOR<PlaylistSongCreateWithoutPlaylistInput, PlaylistSongUncheckedCreateWithoutPlaylistInput> | PlaylistSongCreateWithoutPlaylistInput[] | PlaylistSongUncheckedCreateWithoutPlaylistInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutPlaylistInput | PlaylistSongCreateOrConnectWithoutPlaylistInput[]
    createMany?: PlaylistSongCreateManyPlaylistInputEnvelope
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
  }

  export type PlaylistSongUncheckedCreateNestedManyWithoutPlaylistInput = {
    create?: XOR<PlaylistSongCreateWithoutPlaylistInput, PlaylistSongUncheckedCreateWithoutPlaylistInput> | PlaylistSongCreateWithoutPlaylistInput[] | PlaylistSongUncheckedCreateWithoutPlaylistInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutPlaylistInput | PlaylistSongCreateOrConnectWithoutPlaylistInput[]
    createMany?: PlaylistSongCreateManyPlaylistInputEnvelope
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
  }

  export type PlaylistUpdatevibesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PlaylistSongUpdateManyWithoutPlaylistNestedInput = {
    create?: XOR<PlaylistSongCreateWithoutPlaylistInput, PlaylistSongUncheckedCreateWithoutPlaylistInput> | PlaylistSongCreateWithoutPlaylistInput[] | PlaylistSongUncheckedCreateWithoutPlaylistInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutPlaylistInput | PlaylistSongCreateOrConnectWithoutPlaylistInput[]
    upsert?: PlaylistSongUpsertWithWhereUniqueWithoutPlaylistInput | PlaylistSongUpsertWithWhereUniqueWithoutPlaylistInput[]
    createMany?: PlaylistSongCreateManyPlaylistInputEnvelope
    set?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    disconnect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    delete?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    update?: PlaylistSongUpdateWithWhereUniqueWithoutPlaylistInput | PlaylistSongUpdateWithWhereUniqueWithoutPlaylistInput[]
    updateMany?: PlaylistSongUpdateManyWithWhereWithoutPlaylistInput | PlaylistSongUpdateManyWithWhereWithoutPlaylistInput[]
    deleteMany?: PlaylistSongScalarWhereInput | PlaylistSongScalarWhereInput[]
  }

  export type PlaylistSongUncheckedUpdateManyWithoutPlaylistNestedInput = {
    create?: XOR<PlaylistSongCreateWithoutPlaylistInput, PlaylistSongUncheckedCreateWithoutPlaylistInput> | PlaylistSongCreateWithoutPlaylistInput[] | PlaylistSongUncheckedCreateWithoutPlaylistInput[]
    connectOrCreate?: PlaylistSongCreateOrConnectWithoutPlaylistInput | PlaylistSongCreateOrConnectWithoutPlaylistInput[]
    upsert?: PlaylistSongUpsertWithWhereUniqueWithoutPlaylistInput | PlaylistSongUpsertWithWhereUniqueWithoutPlaylistInput[]
    createMany?: PlaylistSongCreateManyPlaylistInputEnvelope
    set?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    disconnect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    delete?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    connect?: PlaylistSongWhereUniqueInput | PlaylistSongWhereUniqueInput[]
    update?: PlaylistSongUpdateWithWhereUniqueWithoutPlaylistInput | PlaylistSongUpdateWithWhereUniqueWithoutPlaylistInput[]
    updateMany?: PlaylistSongUpdateManyWithWhereWithoutPlaylistInput | PlaylistSongUpdateManyWithWhereWithoutPlaylistInput[]
    deleteMany?: PlaylistSongScalarWhereInput | PlaylistSongScalarWhereInput[]
  }

  export type PlaylistCreateNestedOneWithoutSongsInput = {
    create?: XOR<PlaylistCreateWithoutSongsInput, PlaylistUncheckedCreateWithoutSongsInput>
    connectOrCreate?: PlaylistCreateOrConnectWithoutSongsInput
    connect?: PlaylistWhereUniqueInput
  }

  export type SongCreateNestedOneWithoutPlaylistsInput = {
    create?: XOR<SongCreateWithoutPlaylistsInput, SongUncheckedCreateWithoutPlaylistsInput>
    connectOrCreate?: SongCreateOrConnectWithoutPlaylistsInput
    connect?: SongWhereUniqueInput
  }

  export type PlaylistUpdateOneRequiredWithoutSongsNestedInput = {
    create?: XOR<PlaylistCreateWithoutSongsInput, PlaylistUncheckedCreateWithoutSongsInput>
    connectOrCreate?: PlaylistCreateOrConnectWithoutSongsInput
    upsert?: PlaylistUpsertWithoutSongsInput
    connect?: PlaylistWhereUniqueInput
    update?: XOR<XOR<PlaylistUpdateToOneWithWhereWithoutSongsInput, PlaylistUpdateWithoutSongsInput>, PlaylistUncheckedUpdateWithoutSongsInput>
  }

  export type SongUpdateOneRequiredWithoutPlaylistsNestedInput = {
    create?: XOR<SongCreateWithoutPlaylistsInput, SongUncheckedCreateWithoutPlaylistsInput>
    connectOrCreate?: SongCreateOrConnectWithoutPlaylistsInput
    upsert?: SongUpsertWithoutPlaylistsInput
    connect?: SongWhereUniqueInput
    update?: XOR<XOR<SongUpdateToOneWithWhereWithoutPlaylistsInput, SongUpdateWithoutPlaylistsInput>, SongUncheckedUpdateWithoutPlaylistsInput>
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ArticleScoreCreateWithoutArticleInput = {
    id?: string
    substance?: number
    depth?: number
    structure?: number
    vocabulary?: number
    readability?: number
    specificity?: number
    actionability?: number
    engagement?: number
    total?: number
    updatedAt?: Date | string
    socialScore?: number
  }

  export type ArticleScoreUncheckedCreateWithoutArticleInput = {
    id?: string
    substance?: number
    depth?: number
    structure?: number
    vocabulary?: number
    readability?: number
    specificity?: number
    actionability?: number
    engagement?: number
    total?: number
    updatedAt?: Date | string
    socialScore?: number
  }

  export type ArticleScoreCreateOrConnectWithoutArticleInput = {
    where: ArticleScoreWhereUniqueInput
    create: XOR<ArticleScoreCreateWithoutArticleInput, ArticleScoreUncheckedCreateWithoutArticleInput>
  }

  export type ArticleScoreUpsertWithoutArticleInput = {
    update: XOR<ArticleScoreUpdateWithoutArticleInput, ArticleScoreUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleScoreCreateWithoutArticleInput, ArticleScoreUncheckedCreateWithoutArticleInput>
    where?: ArticleScoreWhereInput
  }

  export type ArticleScoreUpdateToOneWithWhereWithoutArticleInput = {
    where?: ArticleScoreWhereInput
    data: XOR<ArticleScoreUpdateWithoutArticleInput, ArticleScoreUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleScoreUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: IntFieldUpdateOperationsInput | number
    depth?: IntFieldUpdateOperationsInput | number
    structure?: IntFieldUpdateOperationsInput | number
    vocabulary?: IntFieldUpdateOperationsInput | number
    readability?: IntFieldUpdateOperationsInput | number
    specificity?: IntFieldUpdateOperationsInput | number
    actionability?: IntFieldUpdateOperationsInput | number
    engagement?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    socialScore?: IntFieldUpdateOperationsInput | number
  }

  export type ArticleScoreUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: IntFieldUpdateOperationsInput | number
    depth?: IntFieldUpdateOperationsInput | number
    structure?: IntFieldUpdateOperationsInput | number
    vocabulary?: IntFieldUpdateOperationsInput | number
    readability?: IntFieldUpdateOperationsInput | number
    specificity?: IntFieldUpdateOperationsInput | number
    actionability?: IntFieldUpdateOperationsInput | number
    engagement?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    socialScore?: IntFieldUpdateOperationsInput | number
  }

  export type ArticleCreateWithoutScoreInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isRead?: boolean
    scheduledFor?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    category?: string | null
    isBookmarked?: boolean
  }

  export type ArticleUncheckedCreateWithoutScoreInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isRead?: boolean
    scheduledFor?: Date | string | null
    imageUrl?: string | null
    url?: string | null
    category?: string | null
    isBookmarked?: boolean
  }

  export type ArticleCreateOrConnectWithoutScoreInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutScoreInput, ArticleUncheckedCreateWithoutScoreInput>
  }

  export type ArticleUpsertWithoutScoreInput = {
    update: XOR<ArticleUpdateWithoutScoreInput, ArticleUncheckedUpdateWithoutScoreInput>
    create: XOR<ArticleCreateWithoutScoreInput, ArticleUncheckedCreateWithoutScoreInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutScoreInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutScoreInput, ArticleUncheckedUpdateWithoutScoreInput>
  }

  export type ArticleUpdateWithoutScoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isBookmarked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ArticleUncheckedUpdateWithoutScoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isBookmarked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlaylistSongCreateWithoutSongInput = {
    order?: number
    playlist: PlaylistCreateNestedOneWithoutSongsInput
  }

  export type PlaylistSongUncheckedCreateWithoutSongInput = {
    playlistId: string
    order?: number
  }

  export type PlaylistSongCreateOrConnectWithoutSongInput = {
    where: PlaylistSongWhereUniqueInput
    create: XOR<PlaylistSongCreateWithoutSongInput, PlaylistSongUncheckedCreateWithoutSongInput>
  }

  export type PlaylistSongCreateManySongInputEnvelope = {
    data: PlaylistSongCreateManySongInput | PlaylistSongCreateManySongInput[]
    skipDuplicates?: boolean
  }

  export type PlaylistSongUpsertWithWhereUniqueWithoutSongInput = {
    where: PlaylistSongWhereUniqueInput
    update: XOR<PlaylistSongUpdateWithoutSongInput, PlaylistSongUncheckedUpdateWithoutSongInput>
    create: XOR<PlaylistSongCreateWithoutSongInput, PlaylistSongUncheckedCreateWithoutSongInput>
  }

  export type PlaylistSongUpdateWithWhereUniqueWithoutSongInput = {
    where: PlaylistSongWhereUniqueInput
    data: XOR<PlaylistSongUpdateWithoutSongInput, PlaylistSongUncheckedUpdateWithoutSongInput>
  }

  export type PlaylistSongUpdateManyWithWhereWithoutSongInput = {
    where: PlaylistSongScalarWhereInput
    data: XOR<PlaylistSongUpdateManyMutationInput, PlaylistSongUncheckedUpdateManyWithoutSongInput>
  }

  export type PlaylistSongScalarWhereInput = {
    AND?: PlaylistSongScalarWhereInput | PlaylistSongScalarWhereInput[]
    OR?: PlaylistSongScalarWhereInput[]
    NOT?: PlaylistSongScalarWhereInput | PlaylistSongScalarWhereInput[]
    playlistId?: StringFilter<"PlaylistSong"> | string
    songId?: StringFilter<"PlaylistSong"> | string
    order?: IntFilter<"PlaylistSong"> | number
  }

  export type PlaylistSongCreateWithoutPlaylistInput = {
    order?: number
    song: SongCreateNestedOneWithoutPlaylistsInput
  }

  export type PlaylistSongUncheckedCreateWithoutPlaylistInput = {
    songId: string
    order?: number
  }

  export type PlaylistSongCreateOrConnectWithoutPlaylistInput = {
    where: PlaylistSongWhereUniqueInput
    create: XOR<PlaylistSongCreateWithoutPlaylistInput, PlaylistSongUncheckedCreateWithoutPlaylistInput>
  }

  export type PlaylistSongCreateManyPlaylistInputEnvelope = {
    data: PlaylistSongCreateManyPlaylistInput | PlaylistSongCreateManyPlaylistInput[]
    skipDuplicates?: boolean
  }

  export type PlaylistSongUpsertWithWhereUniqueWithoutPlaylistInput = {
    where: PlaylistSongWhereUniqueInput
    update: XOR<PlaylistSongUpdateWithoutPlaylistInput, PlaylistSongUncheckedUpdateWithoutPlaylistInput>
    create: XOR<PlaylistSongCreateWithoutPlaylistInput, PlaylistSongUncheckedCreateWithoutPlaylistInput>
  }

  export type PlaylistSongUpdateWithWhereUniqueWithoutPlaylistInput = {
    where: PlaylistSongWhereUniqueInput
    data: XOR<PlaylistSongUpdateWithoutPlaylistInput, PlaylistSongUncheckedUpdateWithoutPlaylistInput>
  }

  export type PlaylistSongUpdateManyWithWhereWithoutPlaylistInput = {
    where: PlaylistSongScalarWhereInput
    data: XOR<PlaylistSongUpdateManyMutationInput, PlaylistSongUncheckedUpdateManyWithoutPlaylistInput>
  }

  export type PlaylistCreateWithoutSongsInput = {
    id?: string
    slug: string
    title: string
    description?: string | null
    philosophy?: string | null
    schedule?: string | null
    vibes?: PlaylistCreatevibesInput | string[]
    coverColor?: string | null
    coverImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaylistUncheckedCreateWithoutSongsInput = {
    id?: string
    slug: string
    title: string
    description?: string | null
    philosophy?: string | null
    schedule?: string | null
    vibes?: PlaylistCreatevibesInput | string[]
    coverColor?: string | null
    coverImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaylistCreateOrConnectWithoutSongsInput = {
    where: PlaylistWhereUniqueInput
    create: XOR<PlaylistCreateWithoutSongsInput, PlaylistUncheckedCreateWithoutSongsInput>
  }

  export type SongCreateWithoutPlaylistsInput = {
    id?: string
    title: string
    audioUrl: string
    source?: string
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SongUncheckedCreateWithoutPlaylistsInput = {
    id?: string
    title: string
    audioUrl: string
    source?: string
    duration?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SongCreateOrConnectWithoutPlaylistsInput = {
    where: SongWhereUniqueInput
    create: XOR<SongCreateWithoutPlaylistsInput, SongUncheckedCreateWithoutPlaylistsInput>
  }

  export type PlaylistUpsertWithoutSongsInput = {
    update: XOR<PlaylistUpdateWithoutSongsInput, PlaylistUncheckedUpdateWithoutSongsInput>
    create: XOR<PlaylistCreateWithoutSongsInput, PlaylistUncheckedCreateWithoutSongsInput>
    where?: PlaylistWhereInput
  }

  export type PlaylistUpdateToOneWithWhereWithoutSongsInput = {
    where?: PlaylistWhereInput
    data: XOR<PlaylistUpdateWithoutSongsInput, PlaylistUncheckedUpdateWithoutSongsInput>
  }

  export type PlaylistUpdateWithoutSongsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    philosophy?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    vibes?: PlaylistUpdatevibesInput | string[]
    coverColor?: NullableStringFieldUpdateOperationsInput | string | null
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaylistUncheckedUpdateWithoutSongsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    philosophy?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    vibes?: PlaylistUpdatevibesInput | string[]
    coverColor?: NullableStringFieldUpdateOperationsInput | string | null
    coverImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SongUpsertWithoutPlaylistsInput = {
    update: XOR<SongUpdateWithoutPlaylistsInput, SongUncheckedUpdateWithoutPlaylistsInput>
    create: XOR<SongCreateWithoutPlaylistsInput, SongUncheckedCreateWithoutPlaylistsInput>
    where?: SongWhereInput
  }

  export type SongUpdateToOneWithWhereWithoutPlaylistsInput = {
    where?: SongWhereInput
    data: XOR<SongUpdateWithoutPlaylistsInput, SongUncheckedUpdateWithoutPlaylistsInput>
  }

  export type SongUpdateWithoutPlaylistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    audioUrl?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SongUncheckedUpdateWithoutPlaylistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    audioUrl?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaylistSongCreateManySongInput = {
    playlistId: string
    order?: number
  }

  export type PlaylistSongUpdateWithoutSongInput = {
    order?: IntFieldUpdateOperationsInput | number
    playlist?: PlaylistUpdateOneRequiredWithoutSongsNestedInput
  }

  export type PlaylistSongUncheckedUpdateWithoutSongInput = {
    playlistId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PlaylistSongUncheckedUpdateManyWithoutSongInput = {
    playlistId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PlaylistSongCreateManyPlaylistInput = {
    songId: string
    order?: number
  }

  export type PlaylistSongUpdateWithoutPlaylistInput = {
    order?: IntFieldUpdateOperationsInput | number
    song?: SongUpdateOneRequiredWithoutPlaylistsNestedInput
  }

  export type PlaylistSongUncheckedUpdateWithoutPlaylistInput = {
    songId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PlaylistSongUncheckedUpdateManyWithoutPlaylistInput = {
    songId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SongCountOutputTypeDefaultArgs instead
     */
    export type SongCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SongCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlaylistCountOutputTypeDefaultArgs instead
     */
    export type PlaylistCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlaylistCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ArticleDefaultArgs instead
     */
    export type ArticleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ArticleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommentDefaultArgs instead
     */
    export type CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ArticleScoreDefaultArgs instead
     */
    export type ArticleScoreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ArticleScoreDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostDefaultArgs instead
     */
    export type PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookDefaultArgs instead
     */
    export type BookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WishlistItemDefaultArgs instead
     */
    export type WishlistItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WishlistItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SongDefaultArgs instead
     */
    export type SongArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SongDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlaylistDefaultArgs instead
     */
    export type PlaylistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlaylistDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlaylistSongDefaultArgs instead
     */
    export type PlaylistSongArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlaylistSongDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MusicAccessLogDefaultArgs instead
     */
    export type MusicAccessLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MusicAccessLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
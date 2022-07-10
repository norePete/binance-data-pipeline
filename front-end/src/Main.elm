module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (classList, class, value, placeholder, id, style, type_, checked, name)
import Http
import Html.Events exposing (..)
import Json.Encode as Encode
import Round


--Main


--declare type
main =
  Browser.element 
  { init = init
  , update = update
  , subscriptions = subscriptions
  , view = view 
  }

--declare data schema
type alias Model = 
  { 
      average: Float
    , volume: Float
    , min: Float
    , max: Float
    , averagebuffer: Float
    , volumebuffer: Float
    , minbuffer: Float
    , maxbuffer: Float
  }

--declare type
init : () -> (Model, Cmd Msg)
init _=
  (Model 
  0.0 0.0 0.0 0.0
  0.0 0.0 0.0 0.0
  , Cmd.none)

--Update 
type Msg 
  = 
  Average String
  | Volume String 
  | Min String
  | Max String
  | Sent (Result Http.Error ())
  | Update
  | Reset

--declare type
update : Msg -> Model -> (Model, Cmd Msg)

update msg model = 
  case msg of 
    Update ->
      ({model | 
          volume = model.volumebuffer
        , average = model.averagebuffer
        , min = model.minbuffer
        , max = model.maxbuffer}
      , postUpdate (
        {model | volume = model.volumebuffer
      , average = model.averagebuffer
      , min = model.minbuffer
      , max = model.maxbuffer}))
    Reset ->
      ({model | 
        volumebuffer = model.volume
      , averagebuffer = model.average
      , minbuffer = model.min
      , maxbuffer = model.max}, Cmd.none)
    Volume v ->
      ({model | volumebuffer = v |> String.toFloat|> Maybe.withDefault 4.6 }, Cmd.none)
    Average a ->                                                             
      ({model | averagebuffer = a |> String.toFloat|> Maybe.withDefault 4.6 }, Cmd.none)
    Min min ->                                                               
      ({model | minbuffer = min |> String.toFloat |> Maybe.withDefault 4.6 }, Cmd.none)
    Max max ->                                                               
      ({model | maxbuffer = max |> String.toFloat |> Maybe.withDefault 4.6 }, Cmd.none)
    Sent result ->
      case result of 
        Result.Ok ok ->
          (model, Cmd.none)
        Result.Err notOk ->
          case notOk of
            Http.BadUrl err ->
              (model, Cmd.none)
            Http.Timeout ->
              (model, Cmd.none)
            Http.NetworkError ->
              (model, Cmd.none)
            Http.BadStatus code ->
              (model, Cmd.none)
            Http.BadBody code ->
              (model, Cmd.none)


--Subscriptions
subscriptions : Model -> Sub Msg
subscriptions model = 
  Sub.none

--View

--declare type
view : Model -> Html Msg
view model =
      div [classList[ ("column", True)]]
      [ h2 [][text "parameters"]
      , div [] [ parameterForm model]
      ]
  
parameterForm : Model -> Html Msg
parameterForm model =
  div []
  [ text "AVERAGE"
  , viewInput "text" "average" (Round.round 1 model.averagebuffer) Average 
  , text "VOLUME"
  , viewInput "text" "volume"  (Round.round 1 model.volumebuffer)  Volume
  , text "MINIMUM"
  , viewInput "text" "min"     (Round.round 1 model.minbuffer)     Min
  , text "MAXIMUM"
  , viewInput "text" "max"     (Round.round 1 model.maxbuffer)     Max
  , button [onClick Update][text "apply"]
  , button [onClick Reset][text "cancel"]
  ] 

viewInput : String -> String -> String -> (String -> msg) -> Html msg
viewInput t p v toMsg = 
      div [][
        label [][]
      , input [ type_ t, placeholder p, value v
      , onInput toMsg] []
      ]


-- HTTP

postUpdate: Model -> Cmd Msg
postUpdate model = 
  Http.post
    { 
      body = updateEncoder model |> Http.jsonBody
    , expect = Http.expectWhatever Sent 
    , url = "http://127.0.0.1:4000/update"
    }

updateEncoder : Model -> Encode.Value
updateEncoder model =
  Encode.object
    [ ("avg", Encode.float model.average)
    , ("vol", Encode.float model.volume)
    , ("min", Encode.float model.min)
    , ("max", Encode.float model.max)
    ]


module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (classList, class, value, placeholder, id, style, type_, checked, name)
import Http
import Html.Events exposing (..)
import Json.Encode as Encode
import Round
import RangeSlider exposing (..)


--Main


type Msg
    = PercentageSliderMsg RangeSlider.Msg
    | TimeSliderMsg RangeSlider.Msg
    | Average String
    | Volume String 
    | Min String
    | Max String
    | Sent (Result Http.Error ())
    | Update
    | Reset



type alias Model =
    { percentageSlider : RangeSlider.RangeSlider
    , timeSlider : RangeSlider.RangeSlider
    , average: Float
    , volume: Float
    , min: Float
    , max: Float
    , averagebuffer: Float
    , volumebuffer: Float
    , minbuffer: Float
    , maxbuffer: Float
    }


init : ( Model, Cmd Msg )
init =
    let
        minPercentage =
            -25.0

        maxPercentage =
            25.0

        percentageTickStep =
            5

        maxPercentageTick =
            Basics.round (maxPercentage / percentageTickStep)

        minPercentageTick =
            Basics.round (minPercentage / percentageTickStep)

        percentageTicks =
            List.range minPercentageTick maxPercentageTick
                |> List.map (\v -> { value = toFloat v * percentageTickStep, isLabeled = False })

        timeFormatter value =
            let
                hours =
                    modBy 24 (floor value)

                minutes =
                    value
                        - toFloat (floor value)
                        |> (*) 60
                        |> round
            in
            String.fromInt hours ++ ":" ++ String.padLeft 2 '0' (String.fromInt minutes)

        timeAxisTicks =
            List.range 0 24
                |> List.map (\v -> AxisTick (toFloat v) (modBy 2 v == 0))

        percentageSlider =
            RangeSlider.init
                |> (setStepSize <| Just 5.0)
                |> setFormatter (\value -> String.fromFloat value ++ "%")
                |> setExtents minPercentage maxPercentage
                |> setValues -10.0 10.0
                |> setAxisTicks percentageTicks

        timeSlider =
            RangeSlider.init
                |> (setStepSize <| Just 0.5)
                |> setFormatter timeFormatter
                |> setExtents 0.0 24.0
                |> setValues 8.0 12.0
                |> setDimensions 400 75
                |> setAxisTicks timeAxisTicks
    in
    ( Model percentageSlider timeSlider
    0.0 0.0 0.0 0.0
    0.0 0.0 0.0 0.0
    , Cmd.none
    )

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PercentageSliderMsg m ->
            let
                updatedModel =
                    RangeSlider.update m model.percentageSlider
            in
            ({model | percentageSlider = updatedModel}, Cmd.none )

        TimeSliderMsg m ->
            let
                updatedModel =
                    RangeSlider.update m model.timeSlider
            in
            ({model | timeSlider = updatedModel}, Cmd.none )
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
          ({model | 
            volumebuffer = v 
            |> String.toFloat
            |> Maybe.withDefault 4.6 }, Cmd.none)
        Average a ->
          ({model |
            averagebuffer = a 
            |> String.toFloat
            |> Maybe.withDefault 4.6 }, Cmd.none)
        Min min ->
          ({model | 
            minbuffer = min 
            |> String.toFloat 
            |> Maybe.withDefault 4.6 }, Cmd.none)
        Max max ->
          ({model | 
            maxbuffer = max 
            |> String.toFloat 
            |> Maybe.withDefault 4.6 }, Cmd.none)
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



view : Model -> Html Msg
view model =
    div []
        [ div []
            [ h1 []
                [ text "A range slider with percentages" ]
            , div []
                [ Html.map PercentageSliderMsg 
                <| RangeSlider.view model.percentageSlider ]
            ]
        , div []
            [ h1 []
                [ text "A range slider with times" ]
            , div []
                [ Html.map TimeSliderMsg 
                <| RangeSlider.view model.timeSlider ]
            ]
        , div []
            [ h2 [][text "parameters"]
            , div [] [ parameterForm model]
            ]
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


main : Program () Model Msg
main =
    Browser.element
        { init = always init
        , update = update
        , view = view
        , subscriptions =
            \model ->
                Sub.batch
                    [ Sub.map PercentageSliderMsg <| RangeSlider.subscriptions model.percentageSlider
                    , Sub.map TimeSliderMsg <| RangeSlider.subscriptions model.timeSlider
                    ]
        }


--Subscriptions
subscriptions : Model -> Sub Msg
subscriptions model = 
  Sub.none

--View


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

